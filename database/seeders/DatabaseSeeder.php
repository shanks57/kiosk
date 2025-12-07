<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Organizer;
use App\Models\Event;
use App\Models\TicketCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure roles exist
        $roles = [
            'superadmin' => Role::firstOrCreate(['name' => 'superadmin']),
            'organizer'  => Role::firstOrCreate(['name' => 'organizer']),
            'user'       => Role::firstOrCreate(['name' => 'user']),
        ];

        // 2. Create users with assigned roles
        $superAdminUser = $this->createUserWithRole(
            email: 'test@example.com',
            name: 'Test User',
            role: $roles['superadmin']
        );

        $organizerUser = $this->createUserWithRole(
            email: 'another@example.com',
            name: 'Another User',
            role: $roles['organizer']
        );

        $normalUser = $this->createUserWithRole(
            email: 'anotheruser@example.com',
            name: 'Another User As User',
            role: $roles['user']
        );

        // 3. Create organizer profile for organizer users
        $this->createOrganizerProfile($organizerUser);

        // 4. Create a sample event for the organizer and ticket categories
        $organizer = $organizerUser->organizer;
        if ($organizer) {
            $event = Event::firstOrCreate([
                'organizer_id' => $organizer->id,
                'title' => 'Sample Conference 2026',
            ], [
                'description' => 'A sample event created by the seeder.',
                'start_time' => now()->addDays(30),
                'end_time' => now()->addDays(31),
                'banner' => 'https://img.freepik.com/vektor-premium/templat-banner-acara-trendi_85212-590.jpg',
            ]);

            // Create ticket categories for the event
            $categories = [
                ['name' => 'Early Bird Pass', 'price' => 150000, 'quota' => 100],
                ['name' => 'Regular Pass', 'price' => 250000, 'quota' => 300],
                ['name' => 'VIP Experience Pass', 'price' => 450000, 'quota' => 50],
            ];

            foreach ($categories as $cat) {
                TicketCategory::firstOrCreate([
                    'event_id' => $event->id,
                    'name' => $cat['name'],
                ], [
                    'price' => $cat['price'],
                    'quota' => $cat['quota'],
                ]);
            }
        }
    }

    /**
     * Create user and attach role
     */
    private function createUserWithRole(string $email, string $name, Role $role): User
    {
        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        if (! $user->roles()->where('role_id', $role->id)->exists()) {
            $user->roles()->attach($role->id);
        }

        return $user;
    }

    /**
     * Create Organizer profile if user has organizer role
     */
    private function createOrganizerProfile(User $user): void
    {
        if (!$user->organizer) {
            Organizer::create([
                'user_id' => $user->id,
                'company_name' => 'Organizer Example',
                'contact_email' => 'organizer@example.com',
                'contact_phone' => '08123456789',
            ]);
        }
    }
}
