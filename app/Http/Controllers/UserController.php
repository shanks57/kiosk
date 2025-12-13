<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    /**
     * Update user profile and company logo
     */
    public function updateProfile(Request $request, User $user)
    {
        // Verify the authenticated user can update this profile
        // abort_if(Auth::id() !== $user->id, 403, 'Unauthorized');

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
            'phone' => 'sometimes|required|string|max:20',
            'logo' => 'sometimes|nullable|image|mimes:jpeg,png,gif,webp|max:5120',
        ]);

        // Update user fields
        if (isset($validated['name'])) {
            $user->name = $validated['name'];
        }
        if (isset($validated['email'])) {
            $user->email = $validated['email'];
        }
        if (isset($validated['phone'])) {
            $user->phone = $validated['phone'];
        }

        // Handle logo upload
        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($user->company && $user->company->company_logo) {
                Storage::disk('public')->delete($user->company->company_logo);
            }

            // Store new logo (use company_logos folder to match other code)
            $logoPath = $request->file('logo')->store('company_logos', 'public');

            // Update company logo column
            if ($user->company) {
                $user->company->update(['company_logo' => $logoPath]);
            }
        }

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user->fresh(),
        ]);
    }
}
