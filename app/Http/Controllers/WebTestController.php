<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Jobs\RunAiTestJob;

class WebTestController extends Controller
{
    // 1. Show the Form (The "Button")
    public function showForm()
    {
        return view('run-test');
    }

    // 2. Handle the Click
    public function submitTest(Request $request)
    {
        // Validate inputs
        $request->validate([
            'url' => 'required|url',
            'instruction' => 'required|string',
        ]);

        // Dispatch the Job (Send to the Kitchen)
        RunAiTestJob::dispatch(
            'functional', // or 'ux', you can make this a dropdown later
            $request->url,
            $request->instruction
        );

        return back()->with('status', 'Test started! Check your terminal for results.');
    }
}