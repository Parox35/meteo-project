import { useEffect, useRef, useState } from 'react'
import './App.css'
import GetMeteo from './GetMeteo';

interface ApiError {
  message: string;
  status?: number;
  code?: string;
}
interface Geo {
  place_id: number,
  licence: string,
  lat: string,
  lon: string,
  city : string,
  country : string
}

const getGeo = (latitude : string, longitude: string, { setVille }: { setVille: (ville: string) => void }) => {
  const [_, setError] = useState<ApiError | null>(null)

  console.log("Get geo");

  useEffect(() => {
    // Fonction asynchrone pour récupérer les données
    const fetchData = async (): Promise<void> => {
      try {
        
        const response = await fetch(`/geo/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        if (!response.ok) {
          throw {
            message: `Erreur HTTP! statut: ${response.status}`,
            status: response.status,
          } as ApiError;
        }

        const result: Geo = await response.json();
        console.log(`Ville : ${result.city}`);
        setVille(result.city);
      } catch (e) {
        const error = e as ApiError;
        setError({
          message: error.message || 'Une erreur est survenue',
          status: error.status,
          code: error.code,
        });
      }
    };

    fetchData();
  }, []);
};

const InputVille = ({ setVille }: { setVille: (ville: string) => void }) => {

  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <form onSubmit={(e) => { e.preventDefault(); setVille(ref.current?.value || '') }}>
        <div className='inputForm'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
          <input type="text" placeholder="Ville" ref={ref} />
        </div>
      </form>
    </div>
  )
};

function App() {
  const [ville, setVille] = useState<string>('');

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var latitude = position.coords.latitude,
          longitude = position.coords.longitude;
        console.log(latitude + " " + longitude);
        getGeo(latitude.toString(), longitude.toString(), { setVille });
        console.log(`ville : ${ville}`);
      },
      (err) => console.log(err)
    );
  }

  return (
    <div className="App">
      <InputVille setVille={setVille}/>
      <GetMeteo ville={ville}/>
    </div>
  )
}

export default App;