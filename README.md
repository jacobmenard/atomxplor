# atomxplor
Vega-AtomXplore Project


Developer: taloy and mel2

Installation guide.
1. run composer install
2. create .env file and set database mysql credentials to your local.
3. run php artisan migration.
4. run seeder for test data
    php artisan db:seed --class=SubjectSeeder
    php artisan db:seed --class=QuestionaireSeeder