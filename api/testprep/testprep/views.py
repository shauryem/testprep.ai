from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
import openai
from django.conf import settings
import json
import logging


logger = logging.getLogger('testprep')

def home_view(request):
    data = {
        'message': 'Welcome to the Home Page!',
        'status': 'success'
    }
    return JsonResponse(data)

@api_view(['POST'])
def ask_question(request):
    openai.api_key = settings.OPENAI_API_KEY
    client = openai.OpenAI(api_key=openai.api_key)

    try:
    

        request_body = json.loads(request.body.decode())
        # Extracting data from the request body
        difficulty_level = request_body['data'].get('difficulty_level', 'medium')  # Default to 'medium' if not provided
        state = request_body['data'].get('state', 'California')
        num_questions = request_body['data'].get('num_questions', '3')
    
    except Exception as e:
        return Response({'error': 'Invalid request format.'}, status=400)

    # Set the scope of the assistant's abilities
    assistant_instructions = """
    Your task is to generate a comprehensive array object that represents a sample test for the [state] real estate exam. This array should include [num_questions] multiple-choice questions. Each question must be relevant to the [state] real estate sector, covering topics such as laws, financing, appraisal, ethics, and market analysis.

Format Requirement: Each question should be structured with a question statement, four options (A to D), and a designation of the correct answer.
Content Focus: Ensure the questions are diverse and cover the necessary knowledge areas for the [state] real estate exam. The questions generated will be used to help people study for the [state] real estate exam.
Output Structure: The output should be a string representation of an array, adhering to the provided example format.
    """

    # Set the prompt template with placeholders and replace them
    prompt_template = """

Generate a string representation of an array for a [state] real estate exam sample test. The array should include [num_questions] multiple-choice questions, each focusing on a key topic relevant to [state]'s real estate regulations, practices, and principles. Questions should be varied, covering property laws, financing, appraisal, ethics, and market analysis. Provide four options for each question, labeled from A to D, and indicate the correct answer. Structure the array as follows:

[
    {
      "question": "Given the importance of..., what is ...?",
      "options": ["A: Option 1", "B: Option 2", "C: Option 3", "D: Option 4"],
      "correct_answer": "C: Option 3"
    },
    {
      "question": "How does ... influence ...?",
      "options": ["A: Aspect 1", "B: Aspect 2", "C: Aspect 3", "D: Aspect 4"],
      "correct_answer": "D: Aspect 4"
    }
    // Include [number of questions] questions of [difficulty level] following this format
  ]
    """

    prompt = prompt_template.replace("[difficulty level]", difficulty_level) \
                            .replace("[state]", state) \
                            .replace("[num_questions]", num_questions)

    # Generate questions using OpenAI API
    try:
        assistant = client.beta.assistants.create(model="gpt-3.5-turbo",
                                                 tools=[{"type": "retrieval"}], 
                                                 instructions=assistant_instructions)
        
        thread = client.beta.threads.create(
            messages=[
                {"role": "user", "content": prompt}]
        )
        
        run = client.beta.threads.runs.create(
            thread_id=thread.id,
            assistant_id=assistant.id
        )

        while run.status !="completed":
            run = openai.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id
        )

        messages = openai.beta.threads.messages.list(
                thread_id=thread.id
                )
        # Extract generated questions from response
        generated_questions = messages.data[0].content[0].text.value
        try:
            generated_questions_json = json.loads(generated_questions)
            logger.debug(generated_questions_json)
            # Convert generated questions into JSON format and return
            return JsonResponse({"questions": generated_questions_json})
        except Exception as e:
            return Response({'Error when parsing generated questions string as JSON.'}, status=500)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
