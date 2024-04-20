"""
URL configuration for testprep project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include  # Ensure include is imported here
from .views import ask_question, home_view, create_test_from_json, get_all_tests_with_questions


urlpatterns = [
    path('admin/', admin.site.urls),
    path('ask/', ask_question, name='ask_question'),
    path('accounts/', include('allauth.urls')),
    path('', home_view, name='home'),
    path('create-test/', create_test_from_json, name='create_test_from_json'),
    path('tests/', get_all_tests_with_questions, name='get_all_tests_with_questions'),


]
