'use client';

import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/useToast';
import { Toast } from '@/components/Toast';

interface Job {
  jobId: string;
  type: string;
  status: string;
  progress: number;
  createdAt: string;
}

interface QueueStatus {
  pending: number;
  processing: string | null;
  completed: number;
}

const API_URL = 'http://localhost:8080'; // process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const { messages, showToast, removeMessage } = useToast();

  const updateJobProgress = useCallback((jobId: string, progress: number) => {
    setJobs(prev => prev.map(job => 
      job.jobId === jobId ? { ...job, progress } : job
    ));
  }, []);

  const updateJobComplete = useCallback((jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.jobId === jobId ? { ...job, status: 'completed', progress: 100 } : job
    ));
  }, []);

  const handleJobError = useCallback((jobId: string, error: string) => {
    setJobs(prev => prev.map(job => 
      job.jobId === jobId ? { ...job, status: 'error' } : job
    ));
    showToast('error', `Job ${jobId} failed: ${error}`);
  }, [showToast]);

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource(`${API_URL}/api/events`);
    
    eventSource.onopen = () => {
      console.log('SSE Connected');
      setIsConnected(true);
      showToast('info', 'Connected to server');
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      setIsConnected(false);
    };

    eventSource.addEventListener('job-progress', (e) => {
      const data = JSON.parse(e.data);
      updateJobProgress(data.jobId, data.progress);
    });

    eventSource.addEventListener('job-complete', (e) => {
      const data = JSON.parse(e.data);
      updateJobComplete(data.jobId);
      showToast('success', `Job ${data.jobId.slice(0, 8)} completed!`);
    });

    eventSource.addEventListener('job-error', (e) => {
      const data = JSON.parse(e.data);
      handleJobError(data.jobId, data.error);
    });

    eventSource.addEventListener('queue-status', (e) => {
      const data = JSON.parse(e.data);
      setQueueStatus(data);
    });

    eventSource.addEventListener('heartbeat', () => {
      // Silent heartbeat
    });

    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, [updateJobProgress, updateJobComplete, handleJobError, showToast]);

  const createJob = async (type: string) => {
    try {
      const response = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data: {} })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const newJob: Job = {
        jobId: data.jobId,
        type,
        status: data.status,
        progress: 0,
        createdAt: new Date().toISOString()
      };
      
      setJobs(prev => [newJob, ...prev]);
      showToast('info', `Job created: ${data.jobId.slice(0, 8)}`);
    } catch (error) {
      console.error('Failed to create job:', error);
      showToast('error', 'Failed to create job. Check if server is running.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'error': return 'bg-red-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">SSE MVP Test</h1>
        
        {/* Connection Status */}
        <div className="mb-6 flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-600">
            SSE {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {/* Queue Status */}
        {queueStatus && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h2 className="text-lg font-semibold mb-2">Queue Status</h2>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Pending:</span>
                <span className="ml-2 font-medium">{queueStatus.pending}</span>
              </div>
              <div>
                <span className="text-gray-600">Processing:</span>
                <span className="ml-2 font-medium">
                  {queueStatus.processing ? queueStatus.processing.slice(0, 8) : 'None'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Completed:</span>
                <span className="ml-2 font-medium">{queueStatus.completed}</span>
              </div>
            </div>
          </div>
        )}

        {/* Job Creation Buttons */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Create Job</h2>
          <div className="flex gap-3">
            <button
              onClick={() => createJob('standard')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50"
              disabled={!isConnected}
            >
              Standard (5s)
            </button>
            <button
              onClick={() => createJob('long')}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:opacity-50"
              disabled={!isConnected}
            >
              Long (10s)
            </button>
            <button
              onClick={() => createJob('extended')}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition disabled:opacity-50"
              disabled={!isConnected}
            >
              Extended (15s)
            </button>
          </div>
          {!isConnected && (
            <p className="text-sm text-red-600 mt-2">Connect to server to create jobs</p>
          )}
        </div>

        {/* Jobs List */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Jobs</h2>
          {jobs.length === 0 ? (
            <p className="text-gray-500 text-sm">No jobs yet. Create one above!</p>
          ) : (
            <div className="space-y-3">
              {jobs.map(job => (
                <div key={job.jobId} className="border rounded p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-mono text-sm text-gray-600">
                        {job.jobId.slice(0, 8)}...
                      </span>
                      <div className="text-sm mt-1">
                        <span className="capitalize px-2 py-1 rounded text-xs bg-gray-100">
                          {job.type}
                        </span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(job.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(job.status)}`}
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{job.progress}%</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toast Notifications */}
      <Toast messages={messages} removeMessage={removeMessage} />
    </div>
  );
}