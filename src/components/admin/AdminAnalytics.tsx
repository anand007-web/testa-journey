
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { UsersIcon, CheckCircleIcon, XCircleIcon, ClockIcon, BookIcon } from 'lucide-react';

const DIFFICULTY_COLORS = {
  easy: '#4ade80', // green
  medium: '#f97316', // orange
  hard: '#ef4444', // red
};

const CATEGORY_COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f97316', // orange
  '#10b981', // emerald
  '#6366f1', // indigo
  '#14b8a6', // teal
  '#f43f5e', // rose
];

interface AnalyticsData {
  totalUsers: number;
  totalAttempts: number;
  averageScore: number;
  completionRate: number;
  averageTimePerQuestion: number;
  questionsByDifficulty: {
    difficulty: string;
    count: number;
  }[];
  questionsByCategory: {
    category: string;
    count: number;
  }[];
  userPerformance: {
    date: string;
    users: number;
    averageScore: number;
  }[];
  difficultySuccessRate: {
    difficulty: string;
    successRate: number;
  }[];
}

// Mock function to generate sample analytics data
const generateMockData = (): AnalyticsData => {
  // Get questions from localStorage to calculate real difficulty and category distribution
  let questions = [];
  try {
    const storedQuestions = localStorage.getItem('admin_questions');
    if (storedQuestions) {
      questions = JSON.parse(storedQuestions);
    }
  } catch (error) {
    console.error('Error parsing questions:', error);
    questions = [];
  }

  // Calculate question distribution by difficulty
  const difficultyCount: Record<string, number> = { easy: 0, medium: 0, hard: 0 };
  
  // Calculate question distribution by category
  const categoryCount: Record<string, number> = {};
  
  questions.forEach((q: any) => {
    // Count by difficulty
    if (q.difficulty) {
      difficultyCount[q.difficulty] = (difficultyCount[q.difficulty] || 0) + 1;
    }
    
    // Count by category
    if (q.category) {
      categoryCount[q.category] = (categoryCount[q.category] || 0) + 1;
    } else {
      categoryCount['general'] = (categoryCount['general'] || 0) + 1;
    }
  });

  // Convert difficulty counts to array format
  const questionsByDifficulty = Object.keys(difficultyCount).map(difficulty => ({
    difficulty,
    count: difficultyCount[difficulty]
  }));

  // Convert category counts to array format
  const questionsByCategory = Object.keys(categoryCount).map(category => ({
    category,
    count: categoryCount[category]
  }));

  // Generate last 7 days for user performance graph
  const userPerformance = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      users: Math.floor(Math.random() * 50) + 10,
      averageScore: Math.floor(Math.random() * 40) + 60, // 60-100% score
    };
  });

  return {
    totalUsers: Math.floor(Math.random() * 1000) + 500,
    totalAttempts: Math.floor(Math.random() * 5000) + 1000,
    averageScore: Math.floor(Math.random() * 30) + 65, // 65-95% average score
    completionRate: Math.floor(Math.random() * 20) + 75, // 75-95% completion rate
    averageTimePerQuestion: Math.floor(Math.random() * 30) + 30, // 30-60 seconds per question
    questionsByDifficulty,
    questionsByCategory,
    userPerformance,
    difficultySuccessRate: [
      { difficulty: 'easy', successRate: Math.floor(Math.random() * 15) + 80 }, // 80-95%
      { difficulty: 'medium', successRate: Math.floor(Math.random() * 20) + 60 }, // 60-80%
      { difficulty: 'hard', successRate: Math.floor(Math.random() * 25) + 40 }, // 40-65%
    ]
  };
};

const AdminAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with a delay
    setIsLoading(true);
    setTimeout(() => {
      setAnalyticsData(generateMockData());
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-muted-foreground">Loading analytics data...</p>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="p-8 text-center">
        <p>Error loading analytics data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.averageScore}%</div>
            <p className="text-xs text-muted-foreground">Across all tests</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <BookIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.completionRate}%</div>
            <p className="text-xs text-muted-foreground">Of started tests</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time per Question</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.averageTimePerQuestion}s</div>
            <p className="text-xs text-muted-foreground">Time spent per question</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance">
        <TabsList>
          <TabsTrigger value="performance">User Performance</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Daily User Activity</CardTitle>
              <CardDescription>Number of users and average score over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analyticsData.userPerformance}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                    <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="users" name="Active Users" fill="#3b82f6" />
                    <Bar yAxisId="right" dataKey="averageScore" name="Avg. Score (%)" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Success Rate by Difficulty</CardTitle>
                <CardDescription>Percentage of correct answers by difficulty level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analyticsData.difficultySuccessRate}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis dataKey="difficulty" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Success Rate']} />
                      <Bar dataKey="successRate" name="Success Rate">
                        {analyticsData.difficultySuccessRate.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={DIFFICULTY_COLORS[entry.difficulty as keyof typeof DIFFICULTY_COLORS]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Test Completion Stats</CardTitle>
                <CardDescription>Breakdown of test completion results</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="h-64 w-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Completed', value: analyticsData.completionRate },
                          { name: 'Abandoned', value: 100 - analyticsData.completionRate }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#4ade80" />
                        <Cell fill="#f87171" />
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, '']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="questions">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Questions by Difficulty</CardTitle>
                <CardDescription>Distribution of questions across difficulty levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.questionsByDifficulty}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="difficulty"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {analyticsData.questionsByDifficulty.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={DIFFICULTY_COLORS[entry.difficulty as keyof typeof DIFFICULTY_COLORS]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Questions by Category</CardTitle>
                <CardDescription>Distribution of questions across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analyticsData.questionsByCategory}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="category" width={80} />
                      <Tooltip />
                      <Bar dataKey="count" name="Questions">
                        {analyticsData.questionsByCategory.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalytics;
