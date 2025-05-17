import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'animate.css';

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: '#1a1a1a',
  zIndex: 1000,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

function App() {
  // Estados generales
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('characters');

  // Estados para personajes
  const [characters, setCharacters] = useState([]);
  const [search, setSearch] = useState('');
  const [characterPage, setCharacterPage] = useState(1);
  const [characterTotalPages, setCharacterTotalPages] = useState(1);

  // Estados para ubicaciones
  const [locations, setLocations] = useState([]);
  const [locationPage, setLocationPage] = useState(1);
  const [locationTotalPages, setLocationTotalPages] = useState(1);

  // Estados para episodios
  const [episodes, setEpisodes] = useState([]);
  const [episodePage, setEpisodePage] = useState(1);
  const [episodeTotalPages, setEpisodeTotalPages] = useState(1);

  // Fetch para personajes
  useEffect(() => {
    if (activeTab === 'characters') {
      setIsLoading(true);
      setError(null);
      fetch(`https://rickandmortyapi.com/api/character?name=${search}&page=${characterPage}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('No se encontraron personajes con ese nombre');
          }
          return res.json();
        })
        .then(data => {
          setCharacters(data.results || []);
          setCharacterTotalPages(data.info?.pages || 1);
        })
        .catch(err => {
          setError(err.message);
          setCharacters([]);
          setCharacterTotalPages(1);
        })
        .finally(() => setIsLoading(false));
    }
  }, [search, characterPage, activeTab]);

  // Fetch para locations
  useEffect(() => {
    if (activeTab === 'locations') {
      setIsLoading(true);
      setError(null);
      fetch(`https://rickandmortyapi.com/api/location?page=${locationPage}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Error al cargar ubicaciones');
          }
          return res.json();
        })
        .then(data => {
          setLocations(data.results || []);
          setLocationTotalPages(data.info?.pages || 1);
        })
        .catch(err => {
          setError(err.message);
          setLocations([]);
          setLocationTotalPages(1);
        })
        .finally(() => setIsLoading(false));
    }
  }, [locationPage, activeTab]);

  // Fetch para episodes
  useEffect(() => {
    if (activeTab === 'episodes') {
      setIsLoading(true);
      setError(null);
      fetch(`https://rickandmortyapi.com/api/episode?page=${episodePage}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Error al cargar episodios');
          }
          return res.json();
        })
        .then(data => {
          setEpisodes(data.results || []);
          setEpisodeTotalPages(data.info?.pages || 1);
        })
        .catch(err => {
          setError(err.message);
          setEpisodes([]);
          setEpisodeTotalPages(1);
        })
        .finally(() => setIsLoading(false));
    }
  }, [episodePage, activeTab]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCharacterPage(1);
  };

  const handlePreviousPage = () => {
    switch(activeTab) {
      case 'characters':
        setCharacterPage(prev => Math.max(prev - 1, 1));
        break;
      case 'locations':
        setLocationPage(prev => Math.max(prev - 1, 1));
        break;
      case 'episodes':
        setEpisodePage(prev => Math.max(prev - 1, 1));
        break;
      default:
        break;
    }
  };

  const handleNextPage = () => {
    switch(activeTab) {
      case 'characters':
        setCharacterPage(prev => Math.min(prev + 1, characterTotalPages));
        break;
      case 'locations':
        setLocationPage(prev => Math.min(prev + 1, locationTotalPages));
        break;
      case 'episodes':
        setEpisodePage(prev => Math.min(prev + 1, episodeTotalPages));
        break;
      default:
        break;
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError(null);
  };

  const getCurrentPageData = () => {
    switch(activeTab) {
      case 'characters':
        return {
          data: characters,
          currentPage: characterPage,
          totalPages: characterTotalPages,
          isEmpty: characters.length === 0
        };
      case 'locations':
        return {
          data: locations,
          currentPage: locationPage,
          totalPages: locationTotalPages,
          isEmpty: locations.length === 0
        };
      case 'episodes':
        return {
          data: episodes,
          currentPage: episodePage,
          totalPages: episodeTotalPages,
          isEmpty: episodes.length === 0
        };
      default:
        return {
          data: [],
          currentPage: 1,
          totalPages: 1,
          isEmpty: true
        };
    }
  };

  const renderContent = () => {
    const { data, isEmpty } = getCurrentPageData();

    if (isLoading) return null;

    if (error || isEmpty) {
      return (
        <div className="animate__animated animate__fadeIn" 
             style={{
               flex: 1,
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               background: 'rgba(0,0,0,0.2)',
               borderRadius: '20px',
               padding: '2rem',
               margin: '1rem auto',
               width: '100%',
               maxWidth: '800px'
             }}>
          <div className="text-center">
            <img 
              src="https://media.giphy.com/media/3o7aD2d7hy9ktXNDP2/giphy.gif" 
              alt="Rick and Morty confused" 
              style={{
                width: 'min(300px, 80%)',
                borderRadius: '15px',
                marginBottom: '2rem'
              }}
            />
            <h4 className="fw-bold mt-4" style={{ color: '#00bfff' }}>
              ¡Wubba Lubba Dub Dub!
            </h4>
            <h5 className="mt-3" style={{ color: '#ffffff' }}>
              {error || `No se encontraron ${activeTab === 'characters' ? 'personajes' : activeTab === 'locations' ? 'ubicaciones' : 'episodios'}.`}
            </h5>
          </div>
        </div>
      );
    }

    switch(activeTab) {
      case 'characters':
        return (
          <div className="row justify-content-center g-4 animate__animated animate__fadeIn">
            {characters.map((character) => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={character.id}>
                <div
                  className="card h-100 border-0"
                  style={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 15px rgba(0,191,255,0.2)'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(151,206,76,0.4)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,191,255,0.2)';
                  }}
                >
                  <img
                    src={character.image}
                    className="card-img-top"
                    alt={character.name}
                    style={{ transition: 'transform 0.4s ease' }}
                  />
                  <div className="card-body text-center" 
                       style={{ 
                         background: 'linear-gradient(180deg, rgba(26,26,26,0.8) 0%, rgba(26,26,26,0.9) 100%)'
                       }}>
                    <h5 className="card-title fw-bold text-white mb-3">{character.name}</h5>
                    <div className="d-flex justify-content-center gap-3">
                      <span className="badge rounded-pill" 
                            style={{
                              backgroundColor: 'rgba(0,191,255,0.2)',
                              color: '#00bfff',
                              padding: '8px 15px'
                            }}>
                        {character.species}
                      </span>
                      <span className={`badge rounded-pill ${
                        character.status === 'Alive'
                          ? 'bg-success'
                          : character.status === 'Dead'
                          ? 'bg-danger'
                          : 'bg-warning'
                        }`}
                        style={{ padding: '8px 15px' }}
                      >
                        {character.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'locations':
        return (
          <div className="row g-4 animate__animated animate__fadeIn">
            {locations.map(location => (
              <div className="col-12 col-md-6 col-lg-4" key={location.id}>
                <div className="card h-100 border-0" style={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  boxShadow: '0 4px 15px rgba(151,206,76,0.2)'
                }}>
                  <div className="card-body p-4">
                    <h5 className="card-title mb-3" style={{ color: '#97ce4c' }}>{location.name}</h5>
                    <p className="card-text mb-2">
                      <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Tipo: </span>
                      <span className="text-white">{location.type || 'Desconocido'}</span>
                    </p>
                    <p className="card-text mb-2">
                      <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Dimensión: </span>
                      <span className="text-white">{location.dimension || 'Desconocida'}</span>
                    </p>
                    <p className="card-text">
                      <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Residentes: </span>
                      <span className="text-white">{location.residents.length}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'episodes':
        return (
          <div className="row g-4 animate__animated animate__fadeIn">
            {episodes.map(episode => (
              <div className="col-12 col-md-6 col-lg-4" key={episode.id}>
                <div className="card h-100 border-0" style={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  boxShadow: '0 4px 15px rgba(255,152,0,0.2)'
                }}>
                  <div className="card-body p-4">
                    <h5 className="card-title mb-3" style={{ color: '#ff9800' }}>{episode.name}</h5>
                    <p className="card-text mb-2">
                      <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Episodio: </span>
                      <span className="text-white">{episode.episode}</span>
                    </p>
                    <p className="card-text mb-2">
                      <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Fecha: </span>
                      <span className="text-white">{episode.air_date}</span>
                    </p>
                    <p className="card-text">
                      <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Personajes: </span>
                      <span className="text-white">{episode.characters.length}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  const { currentPage, totalPages } = getCurrentPageData();
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      margin: 0,
      padding: 0
    }}>
      {isLoading && (
        <div style={overlayStyle}>
          <div className="spinner-border" 
               style={{ 
                 width: '3rem', 
                 height: '3rem',
                 color: '#00bfff' 
               }} 
               role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      <div className="container-fluid px-5 py-5" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        margin: 0,
        padding: '2rem'
      }}>
        <h1 className="text-center mb-5 fw-bold position-relative animate__animated animate__fadeIn" 
            style={{ 
              fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', 
              color: '#00bfff',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              letterSpacing: '1px'
            }}>
          Rick and Morty <span style={{ color: '#97ce4c' }}>Universe</span>
          <div className="position-absolute w-100" 
               style={{
                 height: '4px',
                 background: 'linear-gradient(90deg, #00bfff, #97ce4c)',
                 bottom: '-10px',
                 left: '0',
                 boxShadow: '0 2px 10px rgba(151,206,76,0.3)'
               }}
          />
        </h1>

        {activeTab === 'characters' && (
          <div className="d-flex justify-content-center mb-5 animate__animated animate__fadeIn">
            <div className="position-relative" style={{ width: '80%', maxWidth: '500px' }}>
              <input
                type="text"
                className="form-control shadow-lg placeholder-light"
                placeholder="🔍 Buscar personaje..."
                value={search}
                onChange={handleSearch}
                style={{
                  fontSize: '1.1rem',
                  padding: '1.2rem 1.5rem',
                  borderRadius: '30px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  color: '#ffffff',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease'
                }}
                onFocus={e => e.target.style.border = '2px solid #97ce4c'}
                onBlur={e => e.target.style.border = '2px solid rgba(151,206,76,0.3)'}
              />
              <div style={{
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '90%',
                height: '10px',
                background: 'linear-gradient(90deg, #00bfff33, #97ce4c33)',
                filter: 'blur(8px)',
                borderRadius: '50%'
              }}/>
            </div>
          </div>
        )}

        {/* Modificar el contenedor de botones */}
        <div className="d-flex justify-content-center mb-4 gap-2 gap-md-3 flex-wrap" style={{ padding: '0 1rem' }}>
          <button
            className={`btn ${activeTab === 'characters' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => handleTabChange('characters')}
            style={{
              backgroundColor: activeTab === 'characters' ? 'rgba(0,191,255,0.2)' : 'transparent',
              color: '#00bfff',
              border: '2px solid rgba(0,191,255,0.3)',
              borderRadius: '15px',
              padding: '0.6rem 1rem',  // Reducido para móviles
              fontSize: '0.9rem',      // Reducido para móviles
              width: '100%',           // Ancho completo en móviles
              maxWidth: '150px',       // Máximo ancho en desktop
              margin: '0.25rem'        // Margen para separación
            }}
          >
            Personajes
          </button>
          <button
            className={`btn ${activeTab === 'locations' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => handleTabChange('locations')}
            style={{
              backgroundColor: activeTab === 'locations' ? 'rgba(151,206,76,0.2)' : 'transparent',
              color: '#97ce4c',
              border: '2px solid rgba(151,206,76,0.3)',
              borderRadius: '15px',
              padding: '0.6rem 1rem',  // Reducido para móviles
              fontSize: '0.9rem',      // Reducido para móviles
              width: '100%',           // Ancho completo en móviles
              maxWidth: '150px',       // Máximo ancho en desktop
              margin: '0.25rem'        // Margen para separación
            }}
          >
            Ubicaciones
          </button>
          <button
            className={`btn ${activeTab === 'episodes' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => handleTabChange('episodes')}
            style={{
              backgroundColor: activeTab === 'episodes' ? 'rgba(255,152,0,0.2)' : 'transparent',
              color: '#ff9800',
              border: '2px solid rgba(255,152,0,0.3)',
              borderRadius: '15px',
              padding: '0.6rem 1rem',  // Reducido para móviles
              fontSize: '0.9rem',      // Reducido para móviles
              width: '100%',           // Ancho completo en móviles
              maxWidth: '150px',       // Máximo ancho en desktop
              margin: '0.25rem'        // Margen para separación
            }}
          >
            Episodios
          </button>
        </div>

        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          {renderContent()}
        </div>

        {!isLoading && (
          <div className="d-flex justify-content-center align-items-center mt-5 gap-4 flex-wrap">
            <button
              className="btn px-4 py-2 animate__animated animate__fadeIn"
              disabled={isFirstPage}
              onClick={handlePreviousPage}
              style={{
                backgroundColor: isFirstPage 
                  ? 'rgba(51,51,51,0.5)' 
                  : 'rgba(0,191,255,0.2)',
                color: isFirstPage 
                  ? '#666' 
                  : '#00bfff',
                border: 'none',
                borderRadius: '15px',
                transition: 'all 0.3s ease'
              }}
            >
              ← Anterior
            </button>
            <span className="fw-medium px-4 py-2" style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '15px',
              color: '#ffffff'
            }}>
              Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
            </span>
            <button
              className="btn px-4 py-2"
              disabled={isLastPage}
              onClick={handleNextPage}
              style={{
                backgroundColor: isLastPage
                  ? 'rgba(51,51,51,0.5)'
                  : 'rgba(0,191,255,0.2)',
                color: isLastPage
                  ? '#666'
                  : '#00bfff',
                border: 'none',
                borderRadius: '15px',
                transition: 'all 0.3s ease'
              }}
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>

      <footer className="text-center py-3" style={{
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        color: 'rgba(255, 255, 255, 0.7)' // Cambiado de text-muted a un color más visible
      }}>
        <small>Rick and Morty API © {new Date().getFullYear()}</small>
      </footer>
    </div>
  );
}

export default App;