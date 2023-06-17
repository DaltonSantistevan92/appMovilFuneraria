import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Geolocation, Position } from '@capacitor/geolocation';

declare var google: any;

declare global {
  interface Window {
    initMap: () => void;
  }
}

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private mapLoadedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public mapLoaded$: Observable<boolean> = this.mapLoadedSubject.asObservable();

  private ubicacionSubject: BehaviorSubject<{ provincia: string, canton: string, parroquia: string }> = new BehaviorSubject<{ provincia: string, canton: string, parroquia: string }>({ provincia: '', canton: '', parroquia: '' });

  private map: any; // Variable para almacenar la instancia del mapa
  private markers: any[] = []; // Array para almacenar los marcadores
  private locationMarker: any;
  private directionsRenderer: any;


  empresaLat: number = -2.1596032;
  empresaLng: number = -79.8957842;

  apiKeyGoogleMap = environment.apiKeyGoogleMap;

  constructor() { }

  loadMap(mapElement: HTMLElement, lat: number, lng: number, zoom: number = 15): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKeyGoogleMap}&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject();

      document.body.appendChild(script);

      // Función de inicialización del mapa
      window.initMap = () => {
        const mapOptions = { center: new google.maps.LatLng(lat, lng), zoom: zoom, disableDefaultUI: true, clickableIcons: false };
        this.map = new google.maps.Map(mapElement, mapOptions);
        this.mapLoadedSubject.next(true);
      };
    });
  }

  async getCurrentPosition() {
    const coordinates: Position = await Geolocation.getCurrentPosition();
    return coordinates;
  }

  getProvinciaCantonParroquia(lat: number, lng: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      const latlng = new google.maps.LatLng(lat, lng);

      geocoder.geocode({ location: latlng }, (results: any[], status: string) => {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            // Obtener los componentes de dirección
            const addressComponents = results[0].address_components;
            const address = {
              provincia: this.extractAddressComponent(addressComponents, 'administrative_area_level_1'),
              canton: this.extractAddressComponent(addressComponents, 'administrative_area_level_2'),
              parroquia: this.extractAddressComponent(addressComponents, 'locality')
            };
            resolve(address);
            
          } else {
            reject('No se encontraron resultados de geocodificación.');
          }
        } else {
          reject(`Error en la solicitud de geocodificación: ${status}`);
        }
      });
    });
  }

  extractAddressComponent(addressComponents: any, component: string): string {
    const foundComponent = addressComponents.find((item: any) =>
      item.types.some((type: string) => type === component)
    );
    return foundComponent ? foundComponent.long_name : '';
  }

  addMarker(lat: number, lng: number, title: string, draggable: boolean = false): void {
    if (this.map) {
      // Agregar un marcador al mapa utilizando la ubicación proporcionada
      const markerOptions = { position: { lat, lng }, map: this.map, title: title, draggable: draggable };

      if (draggable) {
        this.locationMarker = new google.maps.Marker(markerOptions);
        this.locationMarker.addListener('dragend', (event: any) => {
          const newPosition = event.latLng;
          const newLat = newPosition.lat();
          const newLng = newPosition.lng();

          // Realiza las operaciones necesarias con las nuevas coordenadas
          this.clearRoute();
          this.drawRoute(this.empresaLat, this.empresaLng, newLat, newLng);
          this.getProvinciaCantonParroquia(newLat, newLng)
            .then(ubicacion => {
              console.log('Ubicación dragend :', ubicacion);
              this.ubicacionSubject.next(ubicacion);
            })
            .catch(error => {
              console.error('Error en la obtención de la ubicación:', error);
            });
        });
      } else {
        const marker = new google.maps.Marker(markerOptions);
        this.markers.push(marker);
        this.setInfoWindow(marker, 'Empresa', 'Vidanova');
      }
    }
  }

  setInfoWindow(marker: any, title: string, subtitle: string) {
    const contentString = `
      <div style="background-color: #ffffff; padding: 10px; border-radius: 5px; text-align: center;">
        <p style="font-weight:bold; margin-bottom: 5px; font-size: 18px;">${title}</p>
        <div>
          <p class="m-0" style="font-size: 14px;">${subtitle}</p>
        </div>
      </div>`;

    const infowindow = new google.maps.InfoWindow({ content: contentString, maxWidth: 250 });

    marker.addListener('click', () => { infowindow.open(this.map, marker); });
  }

  getUbicacionObservable(): Observable<{ provincia: string, canton: string, parroquia: string }> {
    return this.ubicacionSubject.asObservable();
  }

  clearRoute(): void {
    if (this.directionsRenderer) {
      this.directionsRenderer.setDirections({ routes: [] });
    }
  }

  drawRoute(startLat: number, startLng: number, endLat: number, endLng: number): void {
    if (this.map) {
      const directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,// Para suprimir los marcadores de inicio y fin de ruta predeterminados
        polylineOptions: {
          strokeColor: 'blue'// Configura el color de la ruta en azul
        },
        map: this.map
      });

      const startLocation = new google.maps.LatLng(startLat, startLng);
      const endLocation = new google.maps.LatLng(endLat, endLng);

      const request = { origin: startLocation, destination: endLocation, travelMode: google.maps.TravelMode.DRIVING };

      directionsService.route(request, (result: any, status: any) => {
        if (status === 'OK') {
          this.directionsRenderer.setDirections(result);
        }
      });
    }
  }


  /* con observable si coje pero no pinta el market de ubicacion de la empresa */

  /* addMarker(lat: number, lng: number, title: string, draggable: boolean = false): Observable<{ provincia: string, canton: string, parroquia: string }> {
    return new Observable<{ provincia: string, canton: string, parroquia: string }>(observer => {
      if (this.map) {
        // Agregar un marcador al mapa utilizando la ubicación proporcionada
        const markerOptions = {
          position: { lat, lng },
          map: this.map,
          title: title,
          draggable: draggable
        };
  
        if (draggable) {
          this.locationMarker = new google.maps.Marker(markerOptions);
          this.locationMarker.addListener('dragend', (event: any) => {
            const newPosition = event.latLng;
            const newLat = newPosition.lat();
            const newLng = newPosition.lng();
  
            // Realiza las operaciones necesarias con las nuevas coordenadas
            this.clearRoute();
            this.drawRoute(this.empresaLat, this.empresaLng, newLat, newLng);
            this.getProvinciaCantonParroquia(newLat, newLng)
              .then(ubicacion => {
                console.log('new ubicacion',ubicacion);
                observer.next(ubicacion);

                const clienteLocation = new google.maps.LatLng(newLat, newLng);
                // Ajustar el zoom y la posición del mapa para que ambas ubicaciones sean visibles
                const bounds = new google.maps.LatLngBounds();
                bounds.extend(new google.maps.LatLng(this.empresaLat, this.empresaLng));
                bounds.extend(clienteLocation);
                this.map.fitBounds(bounds);
              })
              .catch(error => {
                observer.error(error);
                console.error('Error en la obtención de la ubicación:', error);
              });

             
          });
        } else {
          const marker = new google.maps.Marker(markerOptions);
          this.markers.push(marker);
        }
      } else {
        observer.error('No se ha cargado el mapa');
      }
    });
  } 
  
  
  
  
   // Pintar el marcador de tu ubicación
                this.mapService.addMarker(latitude, longitude, 'Mi ubicación', true);
                  /* .subscribe({
                    next: (updatedUbicacion) => {
                      console.log('Ubicación actualizada:', updatedUbicacion);
                      this.formVenta.patchValue({
                        provincia: updatedUbicacion.provincia,
                        canton: updatedUbicacion.canton,
                        parroquia: updatedUbicacion.parroquia
                      });
                    },
                    error: (error) => {
                      console.error('Error al obtener la ubicación:', error);
                    }
                  }); */




}
