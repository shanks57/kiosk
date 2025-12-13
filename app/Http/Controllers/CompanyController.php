<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class CompanyController extends Controller
{
    /**
     * Upload or change company logo
     */
    public function storeLogo(Request $request, Company $company)
    {
        $user = Auth::user();

        // Authorization: allow if user belongs to company or is organizer of a company (adjust as needed)
        // if ($user->company && $user->company->id !== $company->id) {
        //     abort(403, 'Unauthorized');
        // }

        $validated = $request->validate([
            'company_logo' => 'required|image|mimes:jpeg,png,gif,webp|max:5120',
        ]);

        // delete old logo if exists
        if ($company->company_logo) {
            Storage::disk('public')->delete($company->company_logo);
        }

        $path = $request->file('company_logo')->store('company_logos', 'public');

        $company->company_logo = $path;
        $company->save();

        return response()->json([
            'message' => 'Company logo updated',
            'company_logo' => $path,
        ]);
    }

    /**
     * Remove company logo
     */
    public function destroyLogo(Request $request, Company $company)
    {
        $user = Auth::user();

        // if ($user->company && $user->company->id !== $company->id) {
        //     abort(403, 'Unauthorized');
        // }

        if ($company->company_logo) {
            Storage::disk('public')->delete($company->company_logo);
            $company->company_logo = null;
            $company->save();
        }

        return response()->json([
            'message' => 'Company logo removed',
        ]);
    }
}
