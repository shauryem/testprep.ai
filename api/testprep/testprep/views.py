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

        if not input_text:
            return Response({'error': 'No input text provided.'}, status=400)
    
    except Exception as e:
        return Response({'error': 'Invalid request format.'}, status=400)

    # Set the scope of the assistant's abilities
    assistant_instructions = """
    You are a helpful study assistant that will generate quiz questions and their respective answers based on the input that I give you.
    Based on my instructions for each input, you will either provide me with the questions or you will provide me with a score (from 0-100) of my answers, with an explanation of each incorrect answer.
    """

    # Set the prompt template with placeholders and replace them
    prompt_template = """
    Generate [number of questions] questions based on the following [input type] input. Adjust the difficulty of the questions to be [difficulty level].

    **Input:**
    [Insert input here]
    """

    prompt = prompt_template.replace("[number of questions]", number_of_questions) \
                            .replace("[input type]", input_type) \
                            .replace("[difficulty level]", difficulty_level) \
                            .replace("[Insert input here]", input_text)

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
