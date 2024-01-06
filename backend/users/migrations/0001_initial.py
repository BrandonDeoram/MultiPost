# Generated by Django 4.2.7 on 2023-12-15 00:31

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='NewUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('user_id', models.CharField(max_length=255, unique=True)),
                ('list_users_id', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), blank=[], size=None)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
