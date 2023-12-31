# Generated by Django 4.2.7 on 2023-12-31 21:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_alter_newuser_list_users_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='SocialMediaPlatform',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.CharField(max_length=255, unique=True)),
                ('name', models.CharField(max_length=255)),
                ('platform', models.CharField(max_length=255)),
                ('access_token', models.CharField(max_length=255)),
                ('main_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.newuser')),
            ],
        ),
    ]
