from django.db import models

class Test(models.Model):
    name = models.CharField(max_length=200, default='Default Name')
    created_at = models.DateTimeField(auto_now_add=True)  # Automatically set the field to now when the object is first created.

    def __str__(self):
        return self.name

class Question(models.Model):
    test = models.ForeignKey(Test, related_name='questions', on_delete=models.CASCADE)
    text = models.TextField()
    choices = models.JSONField()  # Stores list of choices, e.g., ["A", "B", "C", "D"]
    correct_answer = models.CharField(max_length=200)

    def __str__(self):
        return self.text

class UserResponse(models.Model):
    question = models.ForeignKey(Question, related_name='responses', on_delete=models.CASCADE)
    user_input = models.CharField(max_length=200)  # The user's selected answer

    def __str__(self):
        return f"Response to {self.question.text}: {self.user_input}"