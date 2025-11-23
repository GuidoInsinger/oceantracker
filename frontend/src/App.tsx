import L from 'leaflet';
import { Crosshair, Mic, MicOff, Plus, Send, Settings, Ship, User, Video } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, Polygon, Polyline, TileLayer, useMap, useMapEvents } from 'react-leaflet';

const SeahoakConsole = () => {
 // Onboarding state
 const [currentScreen, setCurrentScreen] = useState('onboarding');
 const [missionType, setMissionType] = useState<string | null>(null);

 // Mission console state
 const [messages, setMessages] = useState([
 { id: 1, type: 'system', text: 'Mission initialized', time: '14:23' },
 { id: 2, type: 'pilot', text: 'Drone en route to search area', time: '14:24' },
 { id: 3, type: 'operator', text: 'Copy that. Visibility conditions?', time: '14:24' },
 { id: 4, type: 'pilot', text: 'Clear skies, 15 km visibility', time: '14:25' },
 { id: 5, type: 'system', text: 'Drone on station', time: '14:27' }
 ]);

 const [newMessage, setNewMessage] = useState('');
 const [isMuted, setIsMuted] = useState(true);
 const [battery, setBattery] = useState(87);
 const [flightTime, setFlightTime] = useState(34);
const [isDrawing, setIsDrawing] = useState(false);
const [drawingPoints, setDrawingPoints] = useState<[number, number][]>([]);
const [areas, setAreas] = useState<[number, number][][]>([]);
const [isMouseDown, setIsMouseDown] = useState(false);
const [lastKnownPositions, setLastKnownPositions] = useState<[number, number][]>([]);
const [isAddingPosition, setIsAddingPosition] = useState(true);
const mapRef = useRef<L.Map | null>(null);
const [simulationResults, setSimulationResults] = useState<{
  target_ll_history: [number, number][];
  boat_ll_history: [number, number][];
  drone_ll_history: [number, number][];
  sigma_history: number[];
} | null>(null);
const [isSimulating, setIsSimulating] = useState(false);

// Fix for default marker icon in Vite
useEffect(() => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}, []);

 useEffect(() => {
 const interval = setInterval(() => {
 setBattery(prev => Math.max(20, prev - 0.5));
 setFlightTime(prev => Math.max(5, prev - 0.5));
 }, 10000);
 return () => clearInterval(interval);
 }, []);

 const handleSendMessage = (text: string) => {
 if (text.trim()) { 
 setMessages([...messages, {
 id: messages.length + 1,
 type: 'operator',
 text: text,
 time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
 }]);
 setNewMessage('');
 }
 };

// Map instance capture component
const MapInstanceCapture = ({ mapRef }: { mapRef: { current: L.Map | null } }) => {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);
  return null;
};

// Map click handler component
const MapClickHandler = ({ 
  isDrawing, 
  isAddingPosition, 
  onMapClick, 
  onMouseDown, 
  onMouseUp 
}: {
  isDrawing: boolean;
  isAddingPosition: boolean;
  onMapClick: (latlng: [number, number]) => void;
  onMouseDown: () => void;
  onMouseUp: () => void;
}) => {
  useMapEvents({
    click: (e) => {
      const latlng: [number, number] = [e.latlng.lat, e.latlng.lng];
      onMapClick(latlng);
    },
    mousedown: () => {
      onMouseDown();
    },
    mouseup: () => {
      onMouseUp();
    },
  });
  return null;
};

  const runSimulation = async (targetLat: number, targetLon: number) => {
    setIsSimulating(true);
    try {
      const response = await fetch('http://localhost:8000/api/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target_lat: targetLat,
          target_lon: targetLon,
        }),
      });

      if (!response.ok) {
        throw new Error('Simulation failed');
      }

      const data = await response.json();
      setSimulationResults({
        target_ll_history: data.target_ll_history.map(([lat, lon]: [number, number]) => [lat, lon] as [number, number]),
        boat_ll_history: data.boat_ll_history.map(([lat, lon]: [number, number]) => [lat, lon] as [number, number]),
        drone_ll_history: data.drone_ll_history.map(([lat, lon]: [number, number]) => [lat, lon] as [number, number]),
        sigma_history: data.sigma_history,
      });
    } catch (error) {
      console.error('Error running simulation:', error);
      setMessages((prevMessages) => [...prevMessages, {
        id: prevMessages.length + 1,
        type: 'system',
        text: 'Simulation failed. Make sure the backend server is running.',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
      }]);
    } finally {
      setIsSimulating(false);
    }
};

const handleMapClick = (latlng: [number, number]) => {
  if (isAddingPosition && !isDrawing) {
    const newPositions = [...lastKnownPositions, latlng];
    setLastKnownPositions(newPositions);
    setIsAddingPosition(false);
    // Run simulation with the latest position
    runSimulation(latlng[0], latlng[1]);
    return;
  }

  if (!isDrawing) return;
  setDrawingPoints([...drawingPoints, latlng]);
};

const handleMouseDown = () => {
  if (!isDrawing) return;
  setIsMouseDown(true);
};

const handleMouseUp = () => {
  if (isMouseDown) setIsMouseDown(false);
};

const handleDrawAreaClick = () => {
  if (isDrawing) {
    if (drawingPoints.length > 2) {
      setAreas([...areas, drawingPoints]);
    }
    setDrawingPoints([]);
    setIsDrawing(false);
    setIsMouseDown(false);
  } else {
    setIsDrawing(true);
    setDrawingPoints([]);
  }
};

const handleRecenter = () => {
  if (mapRef.current && lastKnownPositions.length > 0) {
    const bounds = L.latLngBounds(lastKnownPositions);
    mapRef.current.fitBounds(bounds, { padding: [50, 50] });
  } else if (mapRef.current) {
    mapRef.current.setView([47.2736, -2.2139], 13);
  }
};

 const handleMissionSelect = (type: string) => {
 setMissionType(type);
 setCurrentScreen('console');
 setIsAddingPosition(true);
 };

 // Onboarding Screen
 if (currentScreen === 'onboarding') {
 return (
 <div style={styles.container}>
 <div style={styles.onboardingWrapper}>
 <h1 style={styles.onboardingTitle}>Rescue</h1>
 <div style={styles.missionCards}>
 <button
 style={styles.missionCard}
 onClick={() => handleMissionSelect('boat')}
 >
 <Ship size={64} strokeWidth={1.5} color="#7dd3fc" />
 <span style={styles.missionCardLabel}>Boat</span>
 </button>
 <button
 style={styles.missionCard}
 onClick={() => handleMissionSelect('person')}
 >
 <User size={64} strokeWidth={1.5} color="#7dd3fc" />
 <span style={styles.missionCardLabel}>Person</span>
 </button>
 </div>
 </div>
 </div>
 );
 }

 // Main Console Screen
 return (
 <div style={styles.container}>
 {/* Top Bar */}
 <div style={styles.topBar}>
 <button style={styles.settingsBtn}>
 <Settings size={20} />
 </button>
 <div style={styles.topBarRight}>
 <button style={{...styles.actionBtn, ...styles.abortBtn}}>
 Abort
 </button>
 <button style={{...styles.actionBtn, ...styles.completedBtn}}>
 Mission Completed
 </button>
 </div>
 </div>

 <div style={styles.mainContent}>
 {/* Left Panel - Map */}
 <div style={styles.mapPanel}>
 <div style={styles.droneStatus}>
 <div style={styles.statusRow}>
 <span style={styles.statusLabel}>Battery</span>
 <span style={{...styles.statusValue, color: battery < 30 ? '#ff4757' : '#00f2ea'}}>
 {battery.toFixed(0)}%
 </span>
 </div>
 <div style={styles.statusRow}>
 <span style={styles.statusLabel}>Flight time</span>
 <span style={{...styles.statusValue, color: flightTime < 10 ? '#ff4757' : '#00f2ea'}}>
 {flightTime.toFixed(0)} min
 </span>
 </div>
 </div>

      {/* Map Content */}
      <div style={{
        ...styles.mapContent,
        cursor: isDrawing ? 'crosshair' : isAddingPosition ? 'crosshair' : 'default'
      }}>
        <MapContainer
          center={[47.2736, -2.2139]}
          zoom={13}
          style={{ width: '100%', height: '100%', zIndex: 1, position: 'relative' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapInstanceCapture mapRef={mapRef} />
          
          <MapClickHandler
            isDrawing={isDrawing}
            isAddingPosition={isAddingPosition}
            onMapClick={handleMapClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          />

          {/* Last known positions (red crosses) */}
          {lastKnownPositions.map((pos, idx) => (
            <Marker
              key={idx}
              position={pos}
              icon={L.divIcon({
                className: 'custom-marker',
                html: `
                  <div style="position: relative;">
                    <svg width="24" height="24" viewBox="0 0 24 24" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
                      <line x1="4" y1="4" x2="20" y2="20" stroke="#ff4757" stroke-width="3" stroke-linecap="round"/>
                      <line x1="20" y1="4" x2="4" y2="20" stroke="#ff4757" stroke-width="3" stroke-linecap="round"/>
                    </svg>
                    <div style="
                      position: absolute;
                      top: 28px;
                      left: 50%;
                      transform: translateX(-50%);
                      font-size: 10px;
                      font-weight: 700;
                      color: #ff4757;
                      background-color: #132337;
                      padding: 2px 6px;
                      border-radius: 4px;
                      white-space: nowrap;
                    ">LKP ${idx + 1}</div>
                  </div>
                `,
                iconSize: [24, 24],
                iconAnchor: [12, 12],
              })}
            />
          ))}

          {/* Simulation paths */}
          {simulationResults && (
            <>
              {/* Target path (person in water) */}
              <Polyline
                positions={simulationResults.target_ll_history}
                pathOptions={{
                  color: '#32a8a8',
                  weight: 3,
                  opacity: 0.8,
                }}
              />
              {/* Boat path */}
              <Polyline
                positions={simulationResults.boat_ll_history}
                pathOptions={{
                  color: '#0066ff',
                  weight: 3,
                  opacity: 0.8,
                }}
              />
              {/* Drone path */}
              <Polyline
                positions={simulationResults.drone_ll_history}
                pathOptions={{
                  color: '#00ff00',
                  weight: 3,
                  opacity: 0.8,
                }}
              />
              {/* Current positions */}
              {simulationResults.target_ll_history.length > 0 && (
                <Marker
                  position={simulationResults.target_ll_history[simulationResults.target_ll_history.length - 1]}
                  icon={L.divIcon({
                    className: 'custom-marker',
                    html: '<div style="width: 12px; height: 12px; background-color: #32a8a8; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>',
                    iconSize: [12, 12],
                    iconAnchor: [6, 6],
                  })}
                />
              )}
              {simulationResults.boat_ll_history.length > 0 && (
                <Marker
                  position={simulationResults.boat_ll_history[simulationResults.boat_ll_history.length - 1]}
                  icon={L.divIcon({
                    className: 'custom-marker',
                    html: '<div style="width: 12px; height: 12px; background-color: #0066ff; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>',
                    iconSize: [12, 12],
                    iconAnchor: [6, 6],
                  })}
                />
              )}
              {simulationResults.drone_ll_history.length > 0 && (
                <Marker
                  position={simulationResults.drone_ll_history[simulationResults.drone_ll_history.length - 1]}
                  icon={L.divIcon({
                    className: 'custom-marker',
                    html: '<div style="width: 12px; height: 12px; background-color: #00ff00; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>',
                    iconSize: [12, 12],
                    iconAnchor: [6, 6],
                  })}
                />
              )}
            </>
          )}

          {/* Render completed areas */}
          {areas.map((area, idx) => (
            <Polygon
              key={idx}
              positions={area}
              pathOptions={{
                fillColor: '#ff9f43',
                fillOpacity: 0.2,
                color: '#ff9f43',
                weight: 1.5,
                dashArray: '8, 4',
              }}
            />
          ))}

          {/* Render current drawing */}
          {drawingPoints.length > 0 && (
            <Polygon
              positions={drawingPoints}
              pathOptions={{
                fillColor: '#ff9f43',
                fillOpacity: drawingPoints.length > 2 ? 0.15 : 0,
                color: '#ff9f43',
                weight: 1.5,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
          )}
        </MapContainer>

        {/* Instruction overlay when adding position */}
        {isAddingPosition && lastKnownPositions.length === 0 && (
          <div style={styles.instructionOverlay}>
            <div style={styles.instructionBox}>
              Click on map to set last known position
            </div>
          </div>
        )}

        {/* Simulation status overlay */}
        {isSimulating && (
          <div style={styles.instructionOverlay}>
            <div style={styles.instructionBox}>
              Running simulation...
            </div>
          </div>
        )}
      </div>

 {/* Map controls */}
 <div style={styles.mapControls}>
 <button
 style={{
 ...styles.mapBtn,
 backgroundColor: isAddingPosition ? '#ff475733' : '#132337cc',
 borderColor: isAddingPosition ? '#ff4757' : '#1e3a5f',
 color: isAddingPosition ? '#ff4757' : '#7dd3fc'
 }}
 onClick={() => setIsAddingPosition(!isAddingPosition)}
 >
 <Plus size={16} style={{marginRight: '6px'}} />
 Add Position
 </button>
 <button
 style={{
 ...styles.mapBtn,
 backgroundColor: isDrawing ? '#ff9f4333' : '#132337cc',
 borderColor: isDrawing ? '#ff9f43' : '#1e3a5f',
 color: isDrawing ? '#ff9f43' : '#7dd3fc'
 }}
 onClick={handleDrawAreaClick}
 >
 {isDrawing ? 'Stop Focus Mode' : 'Focus Search'}
 </button>
 <button style={styles.mapBtn}>
 <Video size={16} style={{marginRight: '6px'}} />
 Live Stream
 </button>
 </div>

      {/* Recenter button */}
      <button style={styles.recenterBtn} onClick={handleRecenter}>
        <Crosshair size={20} />
      </button>
 </div>

 {/* Right Panel - Communications */}
 <div style={styles.commsPanel}>
 {/* Chat Area */}
 <div style={styles.chatArea}>
 {messages.map(msg => (
 <div key={msg.id} style={styles.messageWrapper}>
 <div style={{
 ...styles.message,
 ...(msg.type === 'operator' ? styles.operatorMessage :
 msg.type === 'pilot' ? styles.pilotMessage :
 styles.systemMessage)
 }}>
 <div style={styles.messageHeader}>
 <span style={{
 ...styles.messageSender,
 color: msg.type === 'operator' ? '#00f2ea' :
 msg.type === 'pilot' ? '#7bed9f' :
 '#feca57'
 }}>
 {msg.type === 'operator' ? 'You' :
 msg.type === 'pilot' ? 'Pilot' :
 'System'}
 </span>
 <span style={styles.messageTime}>{msg.time}</span>
 </div>
 <div style={styles.messageText}>{msg.text}</div>
 </div>
 </div>
 ))}
 </div>

 {/* Voice Controls */}
 <div style={styles.voiceControls}>
 <button
 style={{
 ...styles.voiceBtn,
 backgroundColor: isMuted ? '#1e3a5f' : '#2ecc71',
 borderColor: isMuted ? '#00f2ea' : '#2ecc71'
 }}
 onClick={() => setIsMuted(!isMuted)}
 >
 {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
 <span style={styles.voiceBtnText}>
 {isMuted ? 'Push to Talk' : 'Muted'}
 </span>
 </button>
 <div style={styles.audioStatus}>
 {!isMuted && <span style={styles.audioIndicator}>●</span>}
 Audio: {isMuted ? 'Off' : 'Active'}
 </div>
 </div>

 {/* Message Input */}
 <div style={styles.inputArea}>
 <input
 type="text"
 value={newMessage}
 onChange={(e) => setNewMessage(e.target.value)}
 onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(newMessage)}
 placeholder="Type message or coordinates..."
 style={styles.input}
 />
 <button
 style={styles.sendBtn}
 onClick={() => handleSendMessage(newMessage)}
 >
 <Send size={18} />
 </button>
 </div>
 </div>
 </div>
 </div>
 );
};

const styles = {
 container: {
 width: '100vw',
 height: '100vh',
 backgroundColor: '#0a1929',
 color: '#e0e7ff',
 fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
 display: 'flex',
 flexDirection: 'column',
 overflow: 'hidden'
 },
 // Onboarding styles
 onboardingWrapper: {
 flex: 1,
 display: 'flex',
 flexDirection: 'column',
 alignItems: 'center',
 justifyContent: 'center',
 gap: '48px'
 },
 onboardingTitle: {
 fontSize: '48px',
 fontWeight: 700,
 color: '#e0e7ff',
 margin: 0
 },
 missionCards: {
 display: 'flex',
 gap: '32px'
 },
 missionCard: {
 width: '200px',
 height: '200px',
 backgroundColor: '#132337',
 border: '2px solid #1e3a5f',
 borderRadius: '16px',
 display: 'flex',
 flexDirection: 'column',
 alignItems: 'center',
 justifyContent: 'center',
 gap: '20px',
 cursor: 'pointer',
 transition: 'all 0.2s',
 ':hover': {
 borderColor: '#00f2ea'
 }
 },
 missionCardLabel: {
 fontSize: '20px',
 fontWeight: 500,
 color: '#e0e7ff'
 },
 // Console styles
 topBar: {
 height: '60px',
 backgroundColor: '#132337',
 borderBottom: '1px solid #1e3a5f',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between',
 padding: '0 24px'
 },
 settingsBtn: {
 background: 'transparent',
 border: '1px solid #1e3a5f',
 borderRadius: '8px',
 color: '#7dd3fc',
 padding: '8px 12px',
 cursor: 'pointer',
 display: 'flex',
 alignItems: 'center',
 gap: '8px'
 },
 topBarRight: {
 display: 'flex',
 gap: '12px'
 },
 actionBtn: {
 border: 'none',
 borderRadius: '8px',
 padding: '10px 20px',
 fontWeight: 600,
 fontSize: '14px',
 cursor: 'pointer',
 transition: 'all 0.2s'
 },
 abortBtn: {
 backgroundColor: '#ff6b6b',
 color: '#fff',
 boxShadow: '0 0 12px rgba(255, 107, 107, 0.3)',
 fontWeight: 700
 },
 completedBtn: {
 backgroundColor: '#2ecc71',
 color: '#fff',
 boxShadow: '0 0 12px rgba(46, 204, 113, 0.3)',
 fontWeight: 700
 },
 mainContent: {
 flex: 1,
 display: 'flex',
 overflow: 'hidden'
 },
 mapPanel: {
 width: '70%',
 backgroundColor: '#0d1b2a',
 position: 'relative',
 overflow: 'hidden'
 },
 droneStatus: {
 position: 'absolute',
 top: '24px',
 left: '24px',
 backgroundColor: '#132337ee',
 backdropFilter: 'blur(10px)',
 border: '1px solid #00f2ea66',
 borderRadius: '12px',
 padding: '16px',
 zIndex: 10,
 minWidth: '200px',
 boxShadow: '0 0 10px rgba(0, 242, 234, 0.1)'
 },
 statusRow: {
 display: 'flex',
 justifyContent: 'space-between',
 marginBottom: '8px'
 },
 statusLabel: {
 fontSize: '13px',
 color: '#7dd3fc',
 textTransform: 'uppercase',
 letterSpacing: '0.5px'
 },
 statusValue: {
 fontSize: '16px',
 fontWeight: 700,
 fontFamily: 'monospace',
 textShadow: '0 0 8px currentColor'
 },
    mapContent: {
      width: '100%',
      height: '100%',
      position: 'relative'
    },
 positionLabel: {
 fontSize: '10px',
 fontWeight: 700,
 color: '#ff4757',
 backgroundColor: '#132337',
 padding: '2px 6px',
 borderRadius: '4px',
 marginTop: '4px',
 textAlign: 'center',
 whiteSpace: 'nowrap'
 },
 instructionOverlay: {
 position: 'absolute',
 top: '50%',
 left: '50%',
 transform: 'translate(-50%, -50%)',
 zIndex: 10
 },
 instructionBox: {
 backgroundColor: '#132337ee',
 border: '1px solid #00f2ea66',
 borderRadius: '12px',
 padding: '16px 24px',
 fontSize: '16px',
 color: '#7dd3fc',
 textAlign: 'center'
 },
    mapControls: {
      position: 'absolute',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '12px',
      zIndex: 1000,
      pointerEvents: 'auto'
    },
 mapBtn: {
 backgroundColor: '#132337cc',
 backdropFilter: 'blur(10px)',
 border: '1px solid #1e3a5f',
 borderRadius: '8px',
 color: '#7dd3fc',
 padding: '10px 16px',
 fontSize: '13px',
 fontWeight: 500,
 cursor: 'pointer',
 display: 'flex',
 alignItems: 'center'
 },
    recenterBtn: {
      position: 'absolute',
      bottom: '24px',
      right: '24px',
      backgroundColor: '#132337cc',
      backdropFilter: 'blur(10px)',
      border: '1px solid #1e3a5f',
      borderRadius: '8px',
      color: '#7dd3fc',
      padding: '12px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
      zIndex: 1000,
      pointerEvents: 'auto'
    },
 areaSvg: {
 position: 'absolute',
 top: 0,
 left: 0,
 width: '100%',
 height: '100%',
 pointerEvents: 'none',
 overflow: 'visible'
 },
 areaPolygon: {
 fill: 'rgba(255, 159, 67, 0.2)',
 stroke: '#ff9f43',
 strokeWidth: '1.5',
 strokeDasharray: '8,4'
 },
 drawingLine: {
 fill: 'none',
 stroke: '#ff9f43',
 strokeWidth: '1.5',
 strokeLinecap: 'round',
 strokeLinejoin: 'round'
 },
 commsPanel: {
 width: '30%',
 backgroundColor: '#132337',
 borderLeft: '2px solid #00f2ea33',
 display: 'flex',
 flexDirection: 'column',
 boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.3)'
 },
 chatArea: {
 flex: 1,
 overflowY: 'auto',
 padding: '16px',
 display: 'flex',
 flexDirection: 'column',
 gap: '12px'
 },
 messageWrapper: {
 display: 'flex',
 flexDirection: 'column',
 marginBottom: '8px'
 },
 message: {
 padding: '8px 12px',
 maxWidth: '75%',
 borderRadius: '8px',
 position: 'relative'
 },
 operatorMessage: {
 alignSelf: 'flex-end',
 backgroundColor: '#00f2ea22',
 borderTopRightRadius: '2px'
 },
 pilotMessage: {
 alignSelf: 'flex-start',
 backgroundColor: '#1e3a5f',
 borderTopLeftRadius: '2px'
 },
 systemMessage: {
 fontSize: '12px',
 fontStyle: 'italic',
 textAlign: 'center',
 opacity: 0.7,
 alignSelf: 'center',
 backgroundColor: 'transparent',
 maxWidth: '100%'
 },
 messageHeader: {
 display: 'flex',
 justifyContent: 'space-between',
 alignItems: 'baseline',
 marginBottom: '2px',
 gap: '8px'
 },
 messageSender: {
 fontSize: '11px',
 fontWeight: 600,
 textTransform: 'uppercase',
 letterSpacing: '0.3px'
 },
 messageTime: {
 fontSize: '10px',
 color: '#7dd3fc77',
 fontFamily: 'monospace',
 marginLeft: '8px'
 },
 messageText: {
 fontSize: '13px',
 lineHeight: 1.4,
 color: '#e0e7ff',
 wordWrap: 'break-word'
 },
 voiceControls: {
 padding: '16px',
 borderTop: '1px solid #1e3a5f',
 display: 'flex',
 alignItems: 'center',
 gap: '12px',
 backgroundColor: '#0d1b2a'
 },
 voiceBtn: {
 border: '2px solid #00f2ea',
 borderRadius: '8px',
 color: '#e0e7ff',
 padding: '12px 18px',
 fontSize: '13px',
 fontWeight: 600,
 cursor: 'pointer',
 display: 'flex',
 alignItems: 'center',
 gap: '8px',
 transition: 'all 0.2s',
 boxShadow: '0 0 12px rgba(0, 242, 234, 0.2)'
 },
 voiceBtnText: {
 fontSize: '12px'
 },
 audioStatus: {
 fontSize: '12px',
 color: '#7dd3fc',
 display: 'flex',
 alignItems: 'center',
 gap: '6px'
 },
 audioIndicator: {
 color: '#7bed9f',
 fontSize: '16px',
 animation: 'blink 1s infinite'
 },
 inputArea: {
 padding: '16px',
 borderTop: '1px solid #1e3a5f',
 display: 'flex',
 gap: '8px'
 },
 input: {
 flex: 1,
 backgroundColor: '#1e3a5f',
 border: '1px solid #1e3a5f',
 borderRadius: '8px',
 color: '#e0e7ff',
 padding: '10px 12px',
 fontSize: '13px',
 outline: 'none'
 },
 sendBtn: {
 backgroundColor: '#00f2ea',
 border: 'none',
 borderRadius: '8px',
 color: '#0a1929',
 padding: '10px 16px',
 cursor: 'pointer',
 display: 'flex',
 alignItems: 'center'
 }
};

export default SeahoakConsole;
