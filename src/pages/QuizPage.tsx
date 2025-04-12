import React, { useState, useEffect, useCallback, useMemo } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Medal, RotateCcw, Trophy, XCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { generateQuizQuestionsFromAI } from "@/services/quiz-generator";

type QuizState = 'start' | 'question' | 'result';

interface QuizQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: string;
  explanation: string;
}

const QuizPage = () => {
  const [quizState, setQuizState] = useState<QuizState>('start');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [difficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  
  const { toast } = useToast();
  
  const totalQuestions = questions.length;
  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  
  const handleTimeUp = useCallback(() => {
    setIsAnswerSubmitted(true);
    toast({
      title: "Temps écoulé !",
      description: "Vous n'avez pas répondu à temps.",
      variant: "destructive",
    });
  }, [toast]);
  
  // Start the timer when a question is shown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (quizState === 'question' && !isAnswerSubmitted) {
      // Reset timer
      setTimer(30);
      
      // Start a new interval
      interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            handleTimeUp();
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
      
      // Store the interval ID
      setTimerInterval(interval);
    }
    
    // Clean up on unmount or when answer is submitted
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [quizState, currentQuestionIndex, isAnswerSubmitted, handleTimeUp]);
  
  // Clean up timer when component unmounts
  useEffect(() => {
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timerInterval]);
  
  const startQuiz = useCallback(async () => {
    setIsLoading(true);
    try {
      const generatedQuestions = await generateQuizQuestionsFromAI(10, difficulty, true);
      setQuestions(generatedQuestions);
      setQuizState('question');
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } catch (error) {
      console.error("Erreur lors de la génération de questions :", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de générer les questions. Veuillez réessayer."
      });
    } finally {
      setIsLoading(false);
    }
  }, [difficulty, toast]);
  
  const handleAnswerSelect = (answerIndex: number) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(answerIndex);
    }
  };
  
  const handleAnswerSubmit = useCallback(() => {
    if (selectedAnswer === null) return;
    
    // Clear the timer
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    // Check if answer is correct
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
    
    setIsAnswerSubmitted(true);
  }, [selectedAnswer, currentQuestion, timerInterval]);
  
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizState('result');
    }
  }, [currentQuestionIndex, totalQuestions]);
  
  const restartQuiz = useCallback(() => {
    setQuizState('start');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuestions([]);
  }, []);
  
  // Calculate difficulty factor
  const getDifficultyFactor = useCallback((difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 1;
      case 'medium': return 2;
      case 'hard': return 3;
      default: return 1;
    }
  }, []);
  
  // Calculate total score with difficulty bonus
  const calculateTotalScore = useCallback(() => {
    const baseScore = (score / totalQuestions) * 100;
    const difficultyBonus = questions.reduce((total, q) => {
      return total + getDifficultyFactor(q.difficulty);
    }, 0) / totalQuestions;
    
    return Math.round(baseScore * difficultyBonus);
  }, [score, totalQuestions, questions, getDifficultyFactor]);
  
  // Get message based on score
  const getScoreMessage = useCallback(() => {
    const percentage = (score / totalQuestions) * 100;
    
    if (percentage >= 90) return "Expert culturel !";
    if (percentage >= 70) return "Grande connaissance culturelle !";
    if (percentage >= 50) return "Bonnes connaissances !";
    if (percentage >= 30) return "Encore quelques efforts...";
    return "Une occasion d'apprendre !";
  }, [score, totalQuestions]);
  
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {quizState === 'start' && (
              <Card className="shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl md:text-4xl font-bold font-title">Quiz Culturel du Bénin</CardTitle>
                  <CardDescription className="text-lg">
                    Testez vos connaissances sur la culture, l'histoire et les traditions du Bénin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-benin-green/10 rounded-lg p-4 text-benin-green">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle size={20} />
                      Comment jouer
                    </h3>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>Le quiz comporte 10 questions générées par intelligence artificielle</li>
                      <li>Vous avez 30 secondes pour répondre à chaque question</li>
                      <li>Chaque question n'a qu'une seule réponse correcte</li>
                      <li>Votre score final dépendra du nombre de bonnes réponses et de la difficulté des questions</li>
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="w-12 h-12 mx-auto rounded-full bg-benin-yellow/10 flex items-center justify-center mb-2">
                        <Trophy size={24} className="text-benin-yellow" />
                      </div>
                      <h3 className="font-semibold mb-1">Quiz complet</h3>
                      <p className="text-sm text-gray-600">10 questions générées par IA</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="w-12 h-12 mx-auto rounded-full bg-benin-red/10 flex items-center justify-center mb-2">
                        <Medal size={24} className="text-benin-red" />
                      </div>
                      <h3 className="font-semibold mb-1">Difficulté variable</h3>
                      <p className="text-sm text-gray-600">Questions adaptatives</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="w-12 h-12 mx-auto rounded-full bg-benin-green/10 flex items-center justify-center mb-2">
                        <CheckCircle size={24} className="text-benin-green" />
                      </div>
                      <h3 className="font-semibold mb-1">Apprentissage</h3>
                      <p className="text-sm text-gray-600">Explications détaillées</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-center">
                  <Button 
                    className="bg-benin-green hover:bg-benin-green/90 text-white px-8 py-6 text-lg"
                    onClick={startQuiz}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Génération en cours...' : 'Commencer le Quiz'}
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            {quizState === 'question' && currentQuestion && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="bg-benin-green/10 text-benin-green text-sm font-medium px-3 py-1 rounded-full">
                      Question {currentQuestionIndex + 1}/{totalQuestions}
                    </span>
                    <span className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full capitalize">
                      {currentQuestion.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${timer <= 10 ? 'text-benin-red' : 'text-gray-700'}`}>
                      {timer}s
                    </span>
                    <Progress value={(timer / 30) * 100} className="w-20 h-2" />
                  </div>
                </div>
                
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl md:text-2xl">{currentQuestion.question}</CardTitle>
                    <CardDescription>{currentQuestion.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(index)}
                          disabled={isAnswerSubmitted}
                          className={`w-full text-left p-4 rounded-lg transition-colors ${
                            selectedAnswer === index 
                              ? isAnswerSubmitted 
                                ? index === currentQuestion.correctAnswer 
                                  ? 'bg-green-100 border-green-300 border' 
                                  : 'bg-red-100 border-red-300 border'
                                : 'bg-benin-green/10 border-benin-green border'
                              : isAnswerSubmitted && index === currentQuestion.correctAnswer
                                ? 'bg-green-100 border-green-300 border'
                                : 'bg-white border-gray-200 border hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{option}</span>
                            {isAnswerSubmitted && (
                              index === currentQuestion.correctAnswer 
                                ? <CheckCircle size={20} className="text-green-600" /> 
                                : selectedAnswer === index 
                                  ? <XCircle size={20} className="text-red-600" />
                                  : null
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    {isAnswerSubmitted && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium mb-2">Explication</h3>
                        <p className="text-gray-600">{currentQuestion.explanation}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="justify-end space-x-2">
                    {!isAnswerSubmitted ? (
                      <Button 
                        onClick={handleAnswerSubmit}
                        disabled={selectedAnswer === null}
                        className="bg-benin-green hover:bg-benin-green/90"
                      >
                        Soumettre
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleNextQuestion}
                        className="bg-benin-green hover:bg-benin-green/90"
                      >
                        {currentQuestionIndex < totalQuestions - 1 ? 'Question suivante' : 'Voir les résultats'}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
                
                <div className="mt-4">
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
            )}
            
            {quizState === 'result' && (
              <Card className="shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl md:text-4xl font-bold font-title">Résultats du Quiz</CardTitle>
                  <CardDescription className="text-lg">
                    {getScoreMessage()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-benin-green/10 flex items-center justify-center mb-4">
                      <div className="text-center">
                        <span className="text-4xl font-bold text-benin-green">{score}</span>
                        <span className="text-xl text-benin-green">/{totalQuestions}</span>
                      </div>
                    </div>
                    <p className="text-xl">Score total: <span className="font-bold">{calculateTotalScore()}</span> points</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h3 className="font-semibold mb-1">Bonnes réponses</h3>
                      <p className="text-3xl font-bold text-benin-green">{score}</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h3 className="font-semibold mb-1">Mauvaises réponses</h3>
                      <p className="text-3xl font-bold text-benin-red">{totalQuestions - score}</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h3 className="font-semibold mb-1">Précision</h3>
                      <p className="text-3xl font-bold text-benin-yellow">
                        {Math.round((score / totalQuestions) * 100)}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-benin-green/10 rounded-lg p-4 text-benin-green">
                    <h3 className="font-semibold mb-2">Conseils pour améliorer votre score</h3>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>Visitez la section Carte pour découvrir les spécificités culturelles de chaque région</li>
                      <li>Consultez notre galerie multimédia pour vous familiariser avec les arts et traditions</li>
                      <li>Écoutez notre bibliothèque audio pour mieux comprendre les sons du Bénin</li>
                      <li>Rejouer le quiz pour tester à nouveau vos connaissances</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="justify-center space-x-4">
                  <Button 
                    variant="outline"
                    onClick={restartQuiz}
                    className="flex items-center gap-2"
                  >
                    <RotateCcw size={18} />
                    Rejouer
                  </Button>
                  <Button className="bg-benin-green hover:bg-benin-green/90">
                    Partager mes résultats
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QuizPage;
