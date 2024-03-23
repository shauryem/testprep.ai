from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
import openai
from django.conf import settings
import json

@api_view(['POST'])
def ask_question(request):
    openai.api_key = settings.OPENAI_API_KEY
    client = openai.OpenAI(api_key=openai.api_key)

    # Extracting data from the request body
    number_of_questions = request.data.get('number_of_questions', '3')  # Default to 3 if not provided
    input_type = request.data.get('input_type', 'text')  # Default to 'text' if not provided
    difficulty_level = request.data.get('difficulty_level', 'medium')  # Default to 'medium' if not provided
    input_text = request.data.get('input', '')  # No default, must be provided

    if not input_text:
        return Response({'error': 'No input text provided.'}, status=400)

    # Set the prompt template with placeholders and replace them
    prompt_template = """
    Generate [number of questions] questions based on the following [input type] input. Adjust the difficulty of the questions according to [difficulty level].

    **Input:**
    [Insert input here]
    """

    prompt = prompt_template.replace("[number of questions]", number_of_questions) \
                            .replace("[input type]", input_type) \
                            .replace("[difficulty level]", difficulty_level) \
                            .replace("[Insert input here]", input_text)

    # Generate questions using OpenAI API
    try:
        response = client.chat.completions.create(model="gpt-3.5-turbo",  # Adjust the model as necessary
                                                  messages=[{"role": "system", "content": "You are a helpful study assistant that will generate quiz questions based on the prompt and instructions that I give you."},
                                                            {"role": "user", "content": prompt}])
        # Extract generated questions from response
        generated_questions = response.choices[0].message.content

        # Convert generated questions into JSON format and return
        return JsonResponse({"questions": generated_questions})
    except Exception as e:
        return Response({'error': str(e)}, status=500)
