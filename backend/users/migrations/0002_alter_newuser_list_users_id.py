# Generated by Django 4.2.7 on 2023-12-15 00:37

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='newuser',
            name='list_users_id',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), default=list, null=True, size=None),
        ),
    ]
