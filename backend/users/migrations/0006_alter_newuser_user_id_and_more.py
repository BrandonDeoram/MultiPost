# Generated by Django 4.2.7 on 2023-12-31 22:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_socialmediaplatform'),
    ]

    operations = [
        migrations.AlterField(
            model_name='newuser',
            name='user_id',
            field=models.CharField(max_length=1024, unique=True),
        ),
        migrations.AlterField(
            model_name='socialmediaplatform',
            name='access_token',
            field=models.CharField(max_length=1024),
        ),
        migrations.AlterField(
            model_name='socialmediaplatform',
            name='user_id',
            field=models.CharField(max_length=1024, unique=True),
        ),
    ]