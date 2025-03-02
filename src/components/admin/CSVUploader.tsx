
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { UploadIcon, FileIcon } from 'lucide-react';
import { Question, DifficultyLevel } from '@/data/questionData';
import { Label } from '@/components/ui/label';

interface CSVUploaderProps {
  onProcessCSV: (questions: Question[]) => void;
}

const CSVUploader: React.FC<CSVUploaderProps> = ({ onProcessCSV }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const processCSV = async () => {
    if (!file) {
      toast.error('Please select a CSV file');
      return;
    }

    if (!file.name.endsWith('.csv')) {
      toast.error('File must be a CSV');
      return;
    }

    setIsProcessing(true);

    try {
      const text = await file.text();
      const lines = text.split('\n');
      
      // Check if file is empty
      if (lines.length <= 1) {
        toast.error('CSV file is empty or contains only headers');
        setIsProcessing(false);
        return;
      }

      const headers = lines[0].split(',').map(header => header.trim().toLowerCase());
      
      // Validate required headers
      const requiredHeaders = ['category', 'question', 'optiona', 'optionb', 'optionc', 'optiond', 'correctanswer', 'difficulty'];
      const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
      
      if (missingHeaders.length > 0) {
        toast.error(`Missing required headers: ${missingHeaders.join(', ')}`);
        setIsProcessing(false);
        return;
      }

      // Parse CSV data
      const questions: Question[] = [];
      let highestId = 0;

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue; // Skip empty lines
        
        const values = line.split(',').map(value => value.trim());
        
        // Get values from CSV based on header positions
        const categoryIndex = headers.indexOf('category');
        const questionIndex = headers.indexOf('question');
        const optionAIndex = headers.indexOf('optiona');
        const optionBIndex = headers.indexOf('optionb');
        const optionCIndex = headers.indexOf('optionc');
        const optionDIndex = headers.indexOf('optiond');
        const correctAnswerIndex = headers.indexOf('correctanswer');
        const explanationIndex = headers.indexOf('explanation');
        const difficultyIndex = headers.indexOf('difficulty');
        
        // Validate minimum required fields
        if (!values[questionIndex] || !values[optionAIndex] || !values[optionBIndex] || 
            !values[optionCIndex] || !values[optionDIndex] || !values[correctAnswerIndex]) {
          continue; // Skip invalid rows
        }

        // Parse correct answer
        let correctAnswer = parseInt(values[correctAnswerIndex]);
        if (isNaN(correctAnswer) || correctAnswer < 0 || correctAnswer > 3) {
          // Try to parse A, B, C, D format
          const answerMap: { [key: string]: number } = { 'a': 0, 'b': 1, 'c': 2, 'd': 3 };
          const answerKey = values[correctAnswerIndex].toLowerCase();
          correctAnswer = answerMap[answerKey] !== undefined ? answerMap[answerKey] : 0;
        }

        // Validate difficulty
        let difficulty: DifficultyLevel = 'medium';
        if (difficultyIndex >= 0 && values[difficultyIndex]) {
          const difficultyValue = values[difficultyIndex].toLowerCase();
          if (['easy', 'medium', 'hard'].includes(difficultyValue)) {
            difficulty = difficultyValue as DifficultyLevel;
          }
        }

        const question: Question = {
          id: highestId + 1,
          text: values[questionIndex],
          options: [
            values[optionAIndex],
            values[optionBIndex],
            values[optionCIndex],
            values[optionDIndex]
          ],
          correctAnswer,
          explanation: explanationIndex >= 0 ? values[explanationIndex] || '' : '',
          difficulty,
          category: categoryIndex >= 0 ? values[categoryIndex] || 'general' : 'general'
        };

        questions.push(question);
        highestId++;
      }

      if (questions.length === 0) {
        toast.error('No valid questions found in the CSV file');
      } else {
        onProcessCSV(questions);
        setFile(null);
        
        // Reset the file input by clearing its value
        const fileInput = document.getElementById('csv-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
    } catch (error) {
      console.error('Error processing CSV:', error);
      toast.error('Error processing CSV file');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
        <div className="mb-4">
          <UploadIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            Upload a CSV file with your questions
          </p>
        </div>

        <Label htmlFor="csv-upload" className="cursor-pointer">
          <Input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="bg-primary py-2 px-4 rounded-md text-white inline-flex items-center gap-2 hover:bg-primary/90 transition-colors">
            <UploadIcon className="h-4 w-4" />
            Select CSV File
          </div>
        </Label>
      </div>

      {file && (
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
          <FileIcon className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">{Math.round(file.size / 1024)} KB</p>
          </div>
          <Button
            onClick={processCSV}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Upload'}
          </Button>
        </div>
      )}

      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Sample CSV Format:</h3>
        <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
          category,question,optionA,optionB,optionC,optionD,correctAnswer,explanation,difficulty<br/>
          mathematics,What is 2+2?,2,3,4,5,2,The sum of 2 and 2 is 4,easy<br/>
          reasoning,If A=1 and B=2 then C=?,1,2,3,4,2,Following the pattern C=3 but the answer is the index (2),medium
        </pre>
      </div>
    </div>
  );
};

export default CSVUploader;
