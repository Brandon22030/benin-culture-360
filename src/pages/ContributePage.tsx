import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Upload, Camera, Music, BookOpen, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@supabase/supabase-js';
import LoginDialog from '@/components/auth/LoginDialog';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ContributePage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedTab, setSelectedTab] = useState('general');
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    general: {
      title: '',
      region: '',
      description: '',
      source: '',
    },
    gallery: {
      title: '',
      category: '',
      region: '',
      description: '',
      credit: '',
      file: null as File | null,
    },
    audio: {
      title: '',
      artist: '',
      category: '',
      region: '',
      description: '',
      file: null as File | null,
      image: null as File | null,
    },
    quiz: {
      question: '',
      category: '',
      difficulty: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      source: '',
    }
  });

  const handleInputChange = (formType: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [formType]: {
        ...prev[formType as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.quiz.options];
    newOptions[index] = value;
    setFormData(prev => ({
      ...prev,
      quiz: {
        ...prev.quiz,
        options: newOptions
      }
    }));
  };

  const handleFileChange = (formType: string, field: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [formType]: {
        ...prev[formType as keyof typeof prev],
        [field]: file
      }
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentification requise",
        description: "Vous devez être connecté pour soumettre une contribution",
        variant: "destructive",
      });
      setShowLoginDialog(true);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const submissionData = {
        ...formData[selectedTab as keyof typeof formData],
        user_id: user.id,
        user_email: user.email,
        contribution_type: selectedTab,
        status: 'pending',
        created_at: new Date(),
      };
      
      let fileUrls = {};
      
      if (selectedTab === 'gallery' && formData.gallery.file) {
        const fileExt = formData.gallery.file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { data: fileData, error: fileError } = await supabase.storage
          .from('contributions')
          .upload(fileName, formData.gallery.file);
          
        if (fileError) throw fileError;
        
        fileUrls = { 
          ...fileUrls, 
          image_url: `${supabaseUrl}/storage/v1/object/public/contributions/${fileName}` 
        };
      }
      
      if (selectedTab === 'audio') {
        if (formData.audio.file) {
          const fileExt = formData.audio.file.name.split('.').pop();
          const fileName = `${user.id}/${Date.now()}_audio.${fileExt}`;
          
          const { data: fileData, error: fileError } = await supabase.storage
            .from('contributions')
            .upload(fileName, formData.audio.file);
            
          if (fileError) throw fileError;
          
          fileUrls = { 
            ...fileUrls, 
            audio_url: `${supabaseUrl}/storage/v1/object/public/contributions/${fileName}` 
          };
        }
        
        if (formData.audio.image) {
          const fileExt = formData.audio.image.name.split('.').pop();
          const fileName = `${user.id}/${Date.now()}_image.${fileExt}`;
          
          const { data: fileData, error: fileError } = await supabase.storage
            .from('contributions')
            .upload(fileName, formData.audio.image);
            
          if (fileError) throw fileError;
          
          fileUrls = { 
            ...fileUrls, 
            image_url: `${supabaseUrl}/storage/v1/object/public/contributions/${fileName}` 
          };
        }
      }
      
      const { data, error } = await supabase
        .from('contributions')
        .insert([{ ...submissionData, ...fileUrls }]);
      
      if (error) throw error;
      
      setIsSuccess(true);
      
      toast({
        title: "Contribution soumise avec succès !",
        description: "Notre équipe va examiner votre contribution prochainement.",
        variant: "default",
      });
      
      setFormData({
        general: {
          title: '',
          region: '',
          description: '',
          source: '',
        },
        gallery: {
          title: '',
          category: '',
          region: '',
          description: '',
          credit: '',
          file: null,
        },
        audio: {
          title: '',
          artist: '',
          category: '',
          region: '',
          description: '',
          file: null,
          image: null,
        },
        quiz: {
          question: '',
          category: '',
          difficulty: '',
          options: ['', '', '', ''],
          correctAnswer: '',
          explanation: '',
          source: '',
        }
      });
      
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (error: any) {
      console.error('Error submitting contribution:', error);
      toast({
        title: "Erreur lors de l'envoi",
        description: error.message || "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const AuthBanner = () => {
    if (user) return null;
    
    return (
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-8 flex items-center gap-3">
        <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-amber-800 font-medium">Connexion requise</p>
          <p className="text-amber-700 text-sm">Vous devez être connecté pour soumettre une contribution.</p>
        </div>
        <Button 
          variant="default" 
          className="bg-amber-500 hover:bg-amber-600 text-white"
          onClick={() => setShowLoginDialog(true)}
        >
          Se connecter
        </Button>
      </div>
    );
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold font-title mb-6">Contribuez à la Préservation Culturelle</h1>
            <p className="text-lg text-gray-600">
              Partagez vos connaissances, images, enregistrements ou histoires pour enrichir notre base de données culturelles sur le Bénin
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <AuthBanner />
            
            <Tabs defaultValue="general" onValueChange={setSelectedTab}>
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="general">Générale</TabsTrigger>
                <TabsTrigger value="gallery">Galerie</TabsTrigger>
                <TabsTrigger value="audio">Audio</TabsTrigger>
                <TabsTrigger value="quiz">Quiz</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle>Contribution Générale</CardTitle>
                    <CardDescription>
                      Partagez vos connaissances sur la culture béninoise
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Titre de la contribution</Label>
                          <Input 
                            id="title" 
                            placeholder="Titre décrivant votre contribution" 
                            value={formData.general.title}
                            onChange={(e) => handleInputChange('general', 'title', e.target.value)}
                            required 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="region">Région concernée</Label>
                          <Select
                            value={formData.general.region}
                            onValueChange={(value) => handleInputChange('general', 'region', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez une région" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="atlantique">Atlantique</SelectItem>
                              <SelectItem value="zou">Zou</SelectItem>
                              <SelectItem value="collines">Collines</SelectItem>
                              <SelectItem value="borgou">Borgou</SelectItem>
                              <SelectItem value="atacora">Atacora</SelectItem>
                              <SelectItem value="multiple">Plusieurs régions</SelectItem>
                              <SelectItem value="other">Autre / Non applicable</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="description">Description détaillée</Label>
                          <Textarea 
                            id="description" 
                            placeholder="Décrivez votre contribution culturelle en détail..." 
                            rows={6}
                            value={formData.general.description}
                            onChange={(e) => handleInputChange('general', 'description', e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="source">Source (si applicable)</Label>
                          <Input 
                            id="source" 
                            placeholder="Source de l'information" 
                            value={formData.general.source}
                            onChange={(e) => handleInputChange('general', 'source', e.target.value)}
                          />
                        </div>
                        
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-semibold">Télécharger un document ou une image</h3>
                          <p className="mt-1 text-xs text-gray-500">PNG, JPG, PDF jusqu'à 10MB</p>
                          <div className="mt-4">
                            <Input 
                              id="file-upload" 
                              type="file"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                handleFileChange('general', 'file', file);
                              }}
                              className="hidden" 
                            />
                            <Label 
                              htmlFor="file-upload" 
                              className="cursor-pointer inline-flex items-center rounded-md bg-benin-green px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-benin-green/90"
                            >
                              Parcourir les fichiers
                            </Label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-6">
                        <Button 
                          type="submit" 
                          className="bg-benin-green hover:bg-benin-green/90"
                          disabled={isSubmitting || !user}
                        >
                          {isSubmitting ? 'Envoi en cours...' : isSuccess ? 'Envoyé !' : 'Soumettre la contribution'}
                          {isSuccess && <CheckCircle className="ml-2 h-4 w-4" />}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="gallery">
                <Card>
                  <CardHeader>
                    <CardTitle>Contribution à la Galerie</CardTitle>
                    <CardDescription>
                      Partagez des images du patrimoine culturel béninois
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="gallery-title">Titre de l'image</Label>
                          <Input 
                            id="gallery-title" 
                            placeholder="Titre de l'image" 
                            value={formData.gallery.title}
                            onChange={(e) => handleInputChange('gallery', 'title', e.target.value)}
                            required 
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="gallery-category">Catégorie</Label>
                            <Select
                              value={formData.gallery.category}
                              onValueChange={(value) => handleInputChange('gallery', 'category', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une catégorie" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="art">Art</SelectItem>
                                <SelectItem value="architecture">Architecture</SelectItem>
                                <SelectItem value="dance">Danse</SelectItem>
                                <SelectItem value="festival">Festival</SelectItem>
                                <SelectItem value="craft">Artisanat</SelectItem>
                                <SelectItem value="other">Autre</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="gallery-region">Région</Label>
                            <Select
                              value={formData.gallery.region}
                              onValueChange={(value) => handleInputChange('gallery', 'region', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une région" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="atlantique">Atlantique</SelectItem>
                                <SelectItem value="zou">Zou</SelectItem>
                                <SelectItem value="collines">Collines</SelectItem>
                                <SelectItem value="borgou">Borgou</SelectItem>
                                <SelectItem value="atacora">Atacora</SelectItem>
                                <SelectItem value="multiple">Plusieurs régions</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="gallery-description">Description</Label>
                          <Textarea 
                            id="gallery-description" 
                            placeholder="Décrivez l'image et son contexte culturel..." 
                            rows={4}
                            value={formData.gallery.description}
                            onChange={(e) => handleInputChange('gallery', 'description', e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="gallery-credit">Crédit photo</Label>
                          <Input 
                            id="gallery-credit" 
                            placeholder="Nom du photographe ou source" 
                            value={formData.gallery.credit}
                            onChange={(e) => handleInputChange('gallery', 'credit', e.target.value)}
                          />
                        </div>
                        
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                          <Camera className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-semibold">Télécharger une image</h3>
                          <p className="mt-1 text-xs text-gray-500">PNG, JPG jusqu'à 10MB (haute résolution recommandée)</p>
                          <div className="mt-4">
                            <Input 
                              id="gallery-upload" 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                handleFileChange('gallery', 'file', file);
                              }}
                              className="hidden" 
                            />
                            <Label 
                              htmlFor="gallery-upload" 
                              className="cursor-pointer inline-flex items-center rounded-md bg-benin-green px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-benin-green/90"
                            >
                              Sélectionner une image
                            </Label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-6">
                        <Button 
                          type="submit" 
                          className="bg-benin-green hover:bg-benin-green/90"
                          disabled={isSubmitting || !user}
                        >
                          {isSubmitting ? 'Envoi en cours...' : isSuccess ? 'Envoyé !' : 'Soumettre l\'image'}
                          {isSuccess && <CheckCircle className="ml-2 h-4 w-4" />}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="audio">
                <Card>
                  <CardHeader>
                    <CardTitle>Contribution Audio</CardTitle>
                    <CardDescription>
                      Partagez des enregistrements de musiques traditionnelles ou récits
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="audio-title">Titre de l'enregistrement</Label>
                          <Input 
                            id="audio-title" 
                            placeholder="Titre de l'enregistrement audio" 
                            value={formData.audio.title}
                            onChange={(e) => handleInputChange('audio', 'title', e.target.value)}
                            required 
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="artist">Artiste/Interprète</Label>
                            <Input 
                              id="artist" 
                              placeholder="Nom de l'artiste ou du groupe" 
                              value={formData.audio.artist}
                              onChange={(e) => handleInputChange('audio', 'artist', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="audio-category">Catégorie</Label>
                            <Select
                              value={formData.audio.category}
                              onValueChange={(value) => handleInputChange('audio', 'category', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une catégorie" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="percussion">Percussion</SelectItem>
                                <SelectItem value="chant">Chant Traditionnel</SelectItem>
                                <SelectItem value="instrumental">Instrumental</SelectItem>
                                <SelectItem value="recit">Récit Oral</SelectItem>
                                <SelectItem value="ceremonie">Cérémonie</SelectItem>
                                <SelectItem value="other">Autre</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="audio-region">Région d'origine</Label>
                          <Select
                            value={formData.audio.region}
                            onValueChange={(value) => handleInputChange('audio', 'region', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez une région" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="atlantique">Atlantique</SelectItem>
                              <SelectItem value="zou">Zou</SelectItem>
                              <SelectItem value="collines">Collines</SelectItem>
                              <SelectItem value="borgou">Borgou</SelectItem>
                              <SelectItem value="atacora">Atacora</SelectItem>
                              <SelectItem value="multiple">Plusieurs régions</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="audio-description">Description et contexte</Label>
                          <Textarea 
                            id="audio-description" 
                            placeholder="Décrivez l'enregistrement, son contexte culturel et historique..." 
                            rows={4}
                            value={formData.audio.description}
                            onChange={(e) => handleInputChange('audio', 'description', e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                          <Music className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-semibold">Télécharger un fichier audio</h3>
                          <p className="mt-1 text-xs text-gray-500">MP3, WAV jusqu'à 20MB</p>
                          <div className="mt-4">
                            <Input 
                              id="audio-upload" 
                              type="file" 
                              accept="audio/*" 
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                handleFileChange('audio', 'file', file);
                              }}
                              className="hidden" 
                            />
                            <Label 
                              htmlFor="audio-upload" 
                              className="cursor-pointer inline-flex items-center rounded-md bg-benin-green px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-benin-green/90"
                            >
                              Sélectionner un fichier audio
                            </Label>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="audio-image">Image d'illustration (optionnel)</Label>
                          <Input 
                            id="audio-image" 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              handleFileChange('audio', 'image', file);
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-6">
                        <Button 
                          type="submit" 
                          className="bg-benin-green hover:bg-benin-green/90"
                          disabled={isSubmitting || !user}
                        >
                          {isSubmitting ? 'Envoi en cours...' : isSuccess ? 'Envoyé !' : 'Soumettre l\'enregistrement'}
                          {isSuccess && <CheckCircle className="ml-2 h-4 w-4" />}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="quiz">
                <Card>
                  <CardHeader>
                    <CardTitle>Suggestion de Question pour le Quiz</CardTitle>
                    <CardDescription>
                      Proposez des questions pour enrichir notre quiz culturel
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="question">Question proposée</Label>
                          <Textarea 
                            id="question" 
                            placeholder="Écrivez votre question..." 
                            value={formData.quiz.question}
                            onChange={(e) => handleInputChange('quiz', 'question', e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="quiz-category">Catégorie</Label>
                            <Select
                              value={formData.quiz.category}
                              onValueChange={(value) => handleInputChange('quiz', 'category', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une catégorie" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="history">Histoire et Religion</SelectItem>
                                <SelectItem value="art">Arts et Traditions</SelectItem>
                                <SelectItem value="geography">Géographie</SelectItem>
                                <SelectItem value="food">Cuisine</SelectItem>
                                <SelectItem value="language">Langue et Littérature</SelectItem>
                                <SelectItem value="other">Autre</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="difficulty">Difficulté</Label>
                            <Select
                              value={formData.quiz.difficulty}
                              onValueChange={(value) => handleInputChange('quiz', 'difficulty', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Niveau de difficulté" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="easy">Facile</SelectItem>
                                <SelectItem value="medium">Moyen</SelectItem>
                                <SelectItem value="hard">Difficile</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <Label>Options de réponse</Label>
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <span className="bg-benin-green text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">A</span>
                              <Input 
                                placeholder="Option A" 
                                value={formData.quiz.options[0]}
                                onChange={(e) => handleOptionChange(0, e.target.value)}
                                required 
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <span className="bg-benin-green text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">B</span>
                              <Input 
                                placeholder="Option B" 
                                value={formData.quiz.options[1]}
                                onChange={(e) => handleOptionChange(1, e.target.value)}
                                required 
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <span className="bg-benin-green text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">C</span>
                              <Input 
                                placeholder="Option C" 
                                value={formData.quiz.options[2]}
                                onChange={(e) => handleOptionChange(2, e.target.value)}
                                required 
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <span className="bg-benin-green text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">D</span>
                              <Input 
                                placeholder="Option D" 
                                value={formData.quiz.options[3]}
                                onChange={(e) => handleOptionChange(3, e.target.value)}
                                required 
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="correct-answer">Réponse correcte</Label>
                          <Select
                            value={formData.quiz.correctAnswer}
                            onValueChange={(value) => handleInputChange('quiz', 'correctAnswer', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez la bonne réponse" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">Option A</SelectItem>
                              <SelectItem value="1">Option B</SelectItem>
                              <SelectItem value="2">Option C</SelectItem>
                              <SelectItem value="3">Option D</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="explanation">Explication de la réponse</Label>
                          <Textarea 
                            id="explanation" 
                            placeholder="Expliquez pourquoi c'est la bonne réponse..." 
                            rows={3}
                            value={formData.quiz.explanation}
                            onChange={(e) => handleInputChange('quiz', 'explanation', e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="source">Source de l'information</Label>
                          <Input 
                            id="source" 
                            placeholder="D'où provient cette information ? (optionnel)" 
                            value={formData.quiz.source}
                            onChange={(e) => handleInputChange('quiz', 'source', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-6">
                        <Button 
                          type="submit" 
                          className="bg-benin-green hover:bg-benin-green/90"
                          disabled={isSubmitting || !user}
                        >
                          {isSubmitting ? 'Envoi en cours...' : isSuccess ? 'Envoyé !' : 'Soumettre la question'}
                          {isSuccess && <CheckCircle className="ml-2 h-4 w-4" />}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="mt-16">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Comment votre contribution est-elle traitée ?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-benin-green/10 rounded-full flex items-center justify-center mb-4">
                        <Users className="h-8 w-8 text-benin-green" />
                      </div>
                      <h3 className="font-semibold mb-2">1. Soumission</h3>
                      <p className="text-sm text-gray-600">
                        Vous soumettez votre contribution qui est enregistrée dans notre système
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-benin-yellow/10 rounded-full flex items-center justify-center mb-4">
                        <BookOpen className="h-8 w-8 text-benin-yellow" />
                      </div>
                      <h3 className="font-semibold mb-2">2. Vérification</h3>
                      <p className="text-sm text-gray-600">
                        Notre équipe d'experts vérifie l'exactitude et la pertinence de votre contribution
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-benin-red/10 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="h-8 w-8 text-benin-red" />
                      </div>
                      <h3 className="font-semibold mb-2">3. Publication</h3>
                      <p className="text-sm text-gray-600">
                        Après validation, votre contribution est publiée sur la plateforme avec crédit
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-gray-100 pt-6 flex justify-center">
                  <p className="text-sm text-gray-500 max-w-2xl text-center">
                    Nous vous contacterons par email pour vous informer de l'état de votre contribution. 
                    Merci de participer à l'enrichissement et à la préservation du patrimoine culturel béninois !
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <LoginDialog 
        open={showLoginDialog} 
        onOpenChange={setShowLoginDialog} 
      />
    </Layout>
  );
};

export default ContributePage;
