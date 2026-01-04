<?php

namespace Database\Seeders;

use App\Models\Question;
use App\Models\QuestionItem;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $subjectId = 1;

        $questions = new Question;
        $items = new QuestionItem;

        $questionList[] = [
            [
                'subject_id' => $subjectId,
                'question' => 'What happens to the volume of a gas when the pressure increases at constant temperature?',
                'answer' => 'b',
                'question_type' => 'multiple_choice',
            ], 
            [
                'subject_id' => $subjectId,
                'question' => 'Which statement best describes Boyle’s Law?',
                'answer' => 'b',
                'question_type' => 'multiple_choice',
            ], 
            [
                'subject_id' => $subjectId,
                'question' => 'A balloon is squeezed gently. What happens to its air particles based on the Kinetic Molecular Theory?',
                'answer' => 'c',
                'question_type' => 'multiple_choice',
            ], 
            [
                'subject_id' => $subjectId,
                'question' => 'Which situation shows Boyle’s Law in real life?',
                'answer' => 'b',
                'question_type' => 'multiple_choice',
            ], 
            [
                'subject_id' => $subjectId,
                'question' => 'What happens to the volume of a gas when the temperature increases at constant pressure?',
                'answer' => 'a',
                'question_type' => 'multiple_choice',
            ], 
            [
                'subject_id' => $subjectId,
                'question' => 'Which statement best describes Charles’s Law?',
                'answer' => 'a',
                'question_type' => 'multiple_choice',
            ], 
            [
                'subject_id' => $subjectId,
                'question' => 'When a balloon is placed in a freezer, it shrinks. Which explains this using KMT?',
                'answer' => 'a',
                'question_type' => 'multiple_choice',
            ], 
            [
                'subject_id' => $subjectId,
                'question' => 'In Kinetic Molecular Theory, gas particles are described as:',
                'answer' => 'c',
                'question_type' => 'multiple_choice',
            ], 
            [
                'subject_id' => $subjectId,
                'question' => 'A student heats an inflated balloon. Which happens according to Charles’s Law?',
                'answer' => 'b',
                'question_type' => 'multiple_choice',
            ], 
            [
                'subject_id' => $subjectId,
                'question' => 'Why does decreasing the volume of a gas increase its pressure?',
                'answer' => 'b',
                'question_type' => 'multiple_choice',
            ]
        ];

        $questions->create(
            
        );

        $items->create(
            ['question_id' => 1, 'question_choice' => 'a', 'question_text' => 'The volume increases.'],
            ['question_id' => 1, 'question_choice' => 'b', 'question_text' => 'The volume decreases.'],
            ['question_id' => 1, 'question_choice' => 'c', 'question_text' => 'The volume does not change.'],
            ['question_id' => 1, 'question_choice' => 'd', 'question_text' => 'The volume doubles.'],

            ['question_id' => 2, 'question_choice' => 'a', 'question_text' => 'Pressure and volume are directly proportional.'],
            ['question_id' => 2, 'question_choice' => 'b', 'question_text' => 'Pressure and volume are inversely proportional.'],
            ['question_id' => 2, 'question_choice' => 'c', 'question_text' => 'Temperature and volume are inversely proportional.'],
            ['question_id' => 2, 'question_choice' => 'd', 'question_text' => 'Pressure increases as temperature decreases.'],

            ['question_id' => 3, 'question_choice' => 'a', 'question_text' => 'They stop moving.'],
            ['question_id' => 3, 'question_choice' => 'b', 'question_text' => 'They move farther apart.'],
            ['question_id' => 3, 'question_choice' => 'c', 'question_text' => 'They move closer together.'],
            ['question_id' => 3, 'question_choice' => 'd', 'question_text' => 'They become heavier.'],

            ['question_id' => 4, 'question_choice' => 'a', 'question_text' => 'A balloon left under the sun expands.'],
            ['question_id' => 4, 'question_choice' => 'b', 'question_text' => 'A syringe plunger is pulled, and the air inside expands.'],
            ['question_id' => 4, 'question_choice' => 'c', 'question_text' => 'Heating a metal rod makes it longer.'],
            ['question_id' => 4, 'question_choice' => 'd', 'question_text' => 'Water boils faster at higher altitude.'],

            ['question_id' => 5, 'question_choice' => 'a', 'question_text' => 'The volume increases.'],
            ['question_id' => 5, 'question_choice' => 'b', 'question_text' => 'The volume decreases.'],
            ['question_id' => 5, 'question_choice' => 'c', 'question_text' => 'The volume stays the same.'],
            ['question_id' => 5, 'question_choice' => 'd', 'question_text' => 'The volume turns into liquid.'],

            ['question_id' => 6, 'question_choice' => 'a', 'question_text' => 'Temperature and volume are directly proportional.'],
            ['question_id' => 6, 'question_choice' => 'b', 'question_text' => 'Pressure and temperature are inversely proportional.'],
            ['question_id' => 6, 'question_choice' => 'c', 'question_text' => 'Pressure and volume are directly proportional.'],
            ['question_id' => 6, 'question_choice' => 'd', 'question_text' => 'Volume decreases when pressure remains constant.'],

            ['question_id' => 7, 'question_choice' => 'a', 'question_text' => 'Cold temperatures slow particle motion.'],
            ['question_id' => 7, 'question_choice' => 'b', 'question_text' => 'Cold temperatures increase particle motion.'],
            ['question_id' => 7, 'question_choice' => 'c', 'question_text' => 'Cold temperatures increase pressure inside.'],
            ['question_id' => 7, 'question_choice' => 'd', 'question_text' => 'Cold temperatures add more particles.'],

            ['question_id' => 8, 'question_choice' => 'a', 'question_text' => 'Tightly packed and vibrating only.'],
            ['question_id' => 8, 'question_choice' => 'b', 'question_text' => 'Close together but moving slightly.'],
            ['question_id' => 8, 'question_choice' => 'c', 'question_text' => 'Far apart and moving in constant motion.'],
            ['question_id' => 8, 'question_choice' => 'd', 'question_text' => 'Fixed in place with no movement.'],

            ['question_id' => 9, 'question_choice' => 'a', 'question_text' => 'Pressure becomes constant.'],
            ['question_id' => 9, 'question_choice' => 'b', 'question_text' => 'Gas particles move faster and spread out.'],
            ['question_id' => 9, 'question_choice' => 'c', 'question_text' => 'Gas particles cool and move slowly.'],
            ['question_id' => 9, 'question_choice' => 'd', 'question_text' => 'The number of particles increases.'],

            ['question_id' => 10, 'question_choice' => 'a', 'question_text' => 'The particles disappear.'],
            ['question_id' => 10, 'question_choice' => 'b', 'question_text' => 'The particles collide with the walls more often.'],
            ['question_id' => 10, 'question_choice' => 'c', 'question_text' => 'The particles become heavier.'],
            ['question_id' => 10, 'question_choice' => 'd', 'question_text' => 'New particles form inside the container.'],
        );
    }
}
