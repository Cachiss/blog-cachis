import type { Song } from '../interfaces/Song';

export async function getAccessToken (){
        try {		
                const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
                const client_secret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
                const refresh_token = import.meta.env.VITE_SPOTIFY_REFRESH_TOKEN;
                
                const accessToken_response = await fetch("https://accounts.spotify.com/api/token",{
                    method: 'POST',
                      headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
                          },
                      body: new URLSearchParams({
                        grant_type: "refresh_token",
                        refresh_token: refresh_token,
                    }).toString()
                });
                const data = await accessToken_response.json();
                console.log("data \n",data)
                return data.access_token;
                
        } catch (error) {
            console.log(error)
        }    
}


export async function getCurrentSong(access_token: string): Promise<Song|null> {    
    try {
            const payload = {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            };
            const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', payload);
            const data = await response.json();
            console.log(data.item.artists);
            
            return{
                artists: data.item.artists,
                name: data.item.name,
                image: data.item.album.images[0].url
            }
        } catch (error) {
            console.log(error)
            throw new Error(String(error));
        }
}