<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Log;

class RunAiTestJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $type;
    public $url;
    public $instruction;
    public $timeout = 600;

    public function __construct($type, $url, $instruction)
    {
        $this->type = $type;
        $this->url = $url;
        $this->instruction = $instruction;
    }

    public function handle()
    {
        Log::info("Starting Gemini Agent: {$this->type}");

        // For Functional tests, we add strict instructions
        $finalInstruction = $this->instruction;
        if ($this->type === 'functional') {
            $finalInstruction .= " Verify strict functionality. Do not hallucinate.";
        }

        $result = Process::path('/var/www/klydos-ai')
            ->env(['GEMINI_API_KEY' => env('GEMINI_API_KEY')]) 
            ->run([
                './venv/bin/python3', 
                'agent.py',         // UPDATED FILENAME
                $this->url, 
                $finalInstruction
            ]);

        if ($result->failed()) {
            Log::error("Agent Crash: " . $result->errorOutput());
        } else {
            // Parse JSON from Python
            $json = json_decode($result->output(), true);
            
            if ($json['status'] === 'success') {
                Log::info("Test Result: " . $json['output']);
                // TODO: Save $json['output'] to your Database
            } else {
                Log::error("Agent Error: " . $json['message']);
            }
        }
    }
}