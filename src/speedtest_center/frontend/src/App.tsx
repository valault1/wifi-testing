import { useState, useEffect } from 'react';
import './App.css';

// Types
interface NodeInfo {
  ip: string;
  port: number;
  status: string;
}

interface NodesMap {
  [key: string]: NodeInfo;
}

interface SpeedtestResult {
  speed_mbps?: number;
  tool?: string;
  duration_seconds?: number;
  error?: string;
}

interface NodeTestState {
  status: 'idle' | 'running' | 'success' | 'error';
  result?: SpeedtestResult;
}

const BACKEND_URL = 'http://localhost:8082';

function App() {
  const [nodes, setNodes] = useState<NodesMap>({});
  const [loadingNodes, setLoadingNodes] = useState(true);
  const [nodeStates, setNodeStates] = useState<Record<string, NodeTestState>>({});
  const [isRunningAll, setIsRunningAll] = useState(false);

  // Fetch nodes on mount and poll every 5 seconds
  useEffect(() => {
    fetchNodes();
    const interval = setInterval(fetchNodes, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchNodes = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/nodes`);
      const data = await response.json();
      setNodes(data.nodes || {});
      setLoadingNodes(false);
    } catch (error) {
      console.error('Failed to fetch nodes:', error);
      setLoadingNodes(false);
    }
  };

  const runTestOnNode = async (nodeName: string): Promise<void> => {
    setNodeStates(prev => ({
      ...prev,
      [nodeName]: { status: 'running' }
    }));

    try {
      const response = await fetch(`${BACKEND_URL}/api/speedtest?node=${encodeURIComponent(nodeName)}`);
      const data: SpeedtestResult = await response.json();

      setNodeStates(prev => ({
        ...prev,
        [nodeName]: {
          status: data.error ? 'error' : 'success',
          result: data
        }
      }));
    } catch (error) {
      setNodeStates(prev => ({
        ...prev,
        [nodeName]: {
          status: 'error',
          result: { error: 'Failed to connect to backend api' }
        }
      }));
    }
  };

  const runAllSequential = async () => {
    const nodeNames = Object.keys(nodes);
    if (nodeNames.length === 0) return;

    setIsRunningAll(true);

    // Clear previous states
    const resetStates: Record<string, NodeTestState> = {};
    nodeNames.forEach(name => {
      resetStates[name] = { status: 'idle' };
    });
    setNodeStates(resetStates);

    for (const name of nodeNames) {
      // Small delay between tests to be safe
      await new Promise(r => setTimeout(r, 1000));
      await runTestOnNode(name);
    }

    setIsRunningAll(false);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Speedtest Center</h1>
      </header>

      <main className="main-content">
        <div className="controls-panel">
          <h2>Discovered Nodes ({Object.keys(nodes).length})</h2>
          <button
            className="btn btn-primary pulse-btn"
            onClick={runAllSequential}
            disabled={isRunningAll || Object.keys(nodes).length === 0}
          >
            {isRunningAll ? 'Running Tests...' : 'Run All Sequentially'}
          </button>
        </div>

        {loadingNodes ? (
          <div className="loading-state">Scanning network for nodes...</div>
        ) : Object.keys(nodes).length === 0 ? (
          <div className="empty-state">
            <p>No speedtest nodes discovered yet.</p>
            <small>Ensure client servers are running and on the same network.</small>
          </div>
        ) : (
          <div className="nodes-grid">
            {Object.entries(nodes).map(([name, info]) => {
              const state = nodeStates[name] || { status: 'idle' };

              return (
                <div key={name} className={`node-card form-glass ${state.status}`}>
                  <div className="node-header">
                    <h3>{name.replace('Speedtest Node on ', '').split('._speedt')[0]}</h3>
                    <span className="status-badge healthy">Healthy</span>
                  </div>

                  <div className="node-details">
                    <p><strong>IP:</strong> {info.ip}</p>
                    <p><strong>Port:</strong> {info.port}</p>
                  </div>

                  <div className="test-results">
                    {state.status === 'running' && (
                      <div className="spinner-container">
                        <div className="spinner"></div>
                        <span>Testing speed...</span>
                      </div>
                    )}

                    {state.status === 'success' && state.result && (
                      <div className="result-success">
                        <div className="metric">
                          <span className="value">{state.result.speed_mbps}</span>
                          <span className="unit">Mbps</span>
                        </div>
                        <div className="meta">
                          <span>⏱️ {state.result.duration_seconds}s</span>
                          <span>🛠️ {state.result.tool}</span>
                        </div>
                      </div>
                    )}

                    {state.status === 'error' && state.result && (
                      <div className="result-error">
                        ⚠️ {state.result.error}
                      </div>
                    )}
                  </div>

                  <button
                    className="btn btn-secondary action-btn"
                    onClick={() => runTestOnNode(name)}
                    disabled={state.status === 'running' || isRunningAll}
                  >
                    Run Speedtest
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

export default App;
