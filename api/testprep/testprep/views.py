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
        number_of_questions = request_body['data'].get('number_of_questions', '3')  # Default to 3 if not provided
        input_type = request_body['data'].get('input_type', 'text')  # Default to 'text' if not provided
        difficulty_level = request_body['data'].get('difficulty_level', 'medium')  # Default to 'medium' if not provided
        input_text = request_body['data'].get('input', '')  # No default, must be provided
        specified_topic = request_body['data'].get('specified_topic', 'No specified topic.')

        if not input_text:
            return Response({'error': 'No input text provided.'}, status=400)
    
    except Exception as e:
        return Response({'error': 'Invalid request format.'}, status=400)

    # Set the scope of the assistant's abilities
    assistant_instructions = """
    Generate a set of multiple-choice questions based on the provided input text, tailoring your questions so they don't deviate too far from the specific topic in relation to the input text. If there is no specific topic specified, then you can generate questions however you seem fit given around the input text. Each question should come with four options (A, B, C, D), only one of which is correct. The questions should vary in difficulty as specified. Return the data in JSON format with the following structure: a list of questions, where each question is an object containing the question text, an array of options, and the correct answer. Example structure:

{
  "questions": [
    {
      "question": "Given the importance of [specified topic], what is ...?",
      "options": ["A: Option 1", "B: Option 2", "C: Option 3", "D: Option 4"],
      "correct_answer": "C: Option 3"
    },
    {
      "question": "How does [specified topic] influence ...?",
      "options": ["A: Aspect 1", "B: Aspect 2", "C: Aspect 3", "D: Aspect 4"],
      "correct_answer": "D: Aspect 4"
    }
  ]
}
    """

    # Set the prompt template with placeholders and replace them
    prompt_template = """

Based on the input text: [Your input text here], and focusing on the specific topic area (if specified): [specified topic], generate [number of questions] multiple-choice questions of [difficulty level] difficulty. Ensure the questions are relevant to the specified topic only. Please format the response only as a JSON object following the example structure given above.

    """

    prompt = prompt_template.replace("[number of questions]", number_of_questions) \
                            .replace("[input type]", input_type) \
                            .replace("[difficulty level]", difficulty_level) \
                            .replace("[Insert input here]", input_text) \
                            .replace("[specified topic]", specified_topic)

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

        # Convert generated questions into JSON format and return
        return JsonResponse({"questions": generated_questions})
    except Exception as e:
        return Response({'error': str(e)}, status=500)
