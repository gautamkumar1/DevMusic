"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Loader2 } from 'lucide-react'
import PrivateRoute from '@/components/PrivateRoute'
import { toast } from 'sonner'

const CreateWorkspace = () => {
  const [workspaceName, setWorkspaceName] = useState('')
  const [generatedUrl, setGeneratedUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const generateUrl = () => {
    if (!workspaceName) {
      console.error("Workspace name is required");
      return;
    }
  
    setLoading(true);
  
    try {
      // Hardcoded base URL
      const currentUrl = "http://localhost:3000/liveCoding/";
  
      // Clean up the workspace name and combine with the base URL
      const formattedWorkspaceName = workspaceName.toLowerCase().replace(/\s+/g, '-');
      const workspaceUrl = `${currentUrl}${formattedWorkspaceName}`;
  
      setGeneratedUrl(workspaceUrl);
  
      // Store the workspace name in localStorage
      localStorage.setItem('workspaceName', workspaceName);
  
      // Reset loading state after the URL is generated
      setLoading(false);
    } catch (error) {
      console.error('Failed to generate URL: ', error);
      setLoading(false);
    }
  }
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl)
      toast.success('URL copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <div className="min-h-screen bg-[#18181B] flex items-center justify-center p-4">
      <div className="bg-[#242427] rounded-lg shadow-xl p-6 w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
          Forge Your Dev Haven
        </h1>
        <p className="text-center text-orange-300">
          Create a workspace where your code comes to life in real-time
        </p>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Enter workspace name"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            className="w-full bg-[#18181B] border-orange-500 text-orange-100 placeholder-orange-300"
          />
          <Button 
            onClick={generateUrl}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-[#18181B] font-semibold"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5 text-white" />
            ) : (
              "Create Workspace"
            )}
          </Button>
        </div>
        {generatedUrl && (
          <div className="mt-4 p-4 bg-[#2A2A2E] rounded-md">
            <p className="text-sm text-orange-300 mb-2">Your personalized workspace URL:</p>
            <div className="flex items-center justify-between bg-[#18181B] border border-orange-500 rounded-md p-2">
              <span className="text-sm text-orange-100 truncate mr-2">{generatedUrl}</span>
              <Button
                onClick={copyToClipboard}
                variant="ghost"
                size="sm"
                className="flex-shrink-0 text-orange-400 hover:text-orange-300 hover:bg-[#2A2A2E]"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const Page = () => {
  return (
    <PrivateRoute>
      <CreateWorkspace />
    </PrivateRoute>
  );
};

export default Page;
