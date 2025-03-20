
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Trash2, LogOut, FileText, Upload } from "lucide-react";
import FormBuilder from "@/components/FormBuilder";
import FormPreview from "@/components/FormPreview";
import FormShare from "@/components/FormShare";
import ResponsesTable from "@/components/ResponsesTable";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [formTitle, setFormTitle] = useState("Untitled Form");
  const [questions, setQuestions] = useState([
    { id: "1", type: "text", label: "Name", required: true, options: [] },
  ]);
  const [activeTab, setActiveTab] = useState("edit");
  const [mockResponses, setMockResponses] = useState<any[]>([]);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Generate some mock responses for demo purposes
    if (activeTab === "responses") {
      const generateMockResponses = () => {
        return Array.from({ length: 5 }).map((_, index) => ({
          id: `response-${index + 1}`,
          formId: '1',
          submittedAt: new Date(Date.now() - index * 86400000).toISOString(),
          data: {
            "1": `Respondent ${index + 1}`,
            "2": `response${index + 1}@example.com`,
            "3": index % 2 === 0 ? "Great form!" : "Very useful survey, thanks!",
            "4": ["Social Media", "Friend", "Advertisement", "Other"][index % 4],
          }
        }));
      };
      
      setMockResponses(generateMockResponses());
    }
  }, [activeTab]);

  const addQuestion = (type: string) => {
    const newQuestion = {
      id: Date.now().toString(),
      type,
      label: `Question ${questions.length + 1}`,
      required: false,
      options: type === "multiple_choice" || type === "dropdown" ? ["Option 1", "Option 2"] : [],
    };
    
    setQuestions([...questions, newQuestion]);
    toast({
      title: "Question added",
      description: `Added a new ${type} question`,
    });
  };

  const updateQuestion = (id: string, updates: any) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
    toast({
      title: "Question deleted",
      description: "The question has been removed from your form",
      variant: "destructive",
    });
  };

  const handleSignOut = () => {
    signOut();
    navigate('/sign-in');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b p-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Pexo Forms</h1>
          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="text-gray-600">
                  Hello, {user.name}
                </span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="responses">Responses</TabsTrigger>
            </TabsList>
            
            {activeTab === "preview" && (
              <FormShare formId="1" formTitle={formTitle} />
            )}
          </div>

          <TabsContent value="edit">
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Question Types</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => addQuestion("text")}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Text
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => addQuestion("textarea")}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Long Text
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => addQuestion("multiple_choice")}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Multiple Choice
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => addQuestion("dropdown")}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Dropdown
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => addQuestion("number")}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Number
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => addQuestion("file")}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <Upload className="mr-2 h-4 w-4" />
                    File Upload
                  </Button>
                </CardContent>
              </Card>

              <div className="md:col-span-3">
                <FormBuilder
                  formTitle={formTitle}
                  setFormTitle={setFormTitle}
                  questions={questions}
                  updateQuestion={updateQuestion}
                  deleteQuestion={deleteQuestion}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <Card>
              <CardContent className="pt-6">
                <FormPreview title={formTitle} questions={questions} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="responses">
            <Card>
              <CardContent className="pt-6">
                {mockResponses.length > 0 ? (
                  <ResponsesTable 
                    responses={mockResponses} 
                    questions={questions.map(q => ({ id: q.id, label: q.label, type: q.type }))}
                  />
                ) : (
                  <div className="text-center py-10">
                    <h3 className="text-xl font-medium text-gray-500 mb-4">No responses yet</h3>
                    <p className="text-gray-400 mb-6">Share your form to collect responses</p>
                    <Button variant="outline" onClick={() => setActiveTab("preview")}>
                      <FileText className="mr-2 h-4 w-4" />
                      Preview Form
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
