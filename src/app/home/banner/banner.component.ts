import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { IonicSlides } from '@ionic/core';
import { SwiperOptions } from 'swiper';
import { Categoria } from '../interfaces/categoria-producto.interface';
import { CategoriasService } from '../services/categorias.service';
import { Router } from '@angular/router';
import { GeneralService } from '../../services/general.service';
import { ReceptorService } from '../services/receptor.service';



@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent  implements OnInit {
  @ViewChild('swiper') swiper: ElementRef | undefined;//
  @Input() slides : Categoria [] = [];//
  swiperModules = [IonicSlides];//
  selectedCategory : string = '';//
  //config! : SwiperOptions

  hasLoad : boolean = false;

  constructor(
    private _cs : CategoriasService,
    private router: Router,
    private _gs : GeneralService,
    private _r: ReceptorService

  ) {

   }

  ngOnInit() {
    this._cs.$getObjSourceCategoria.subscribe((resp) => {
      if (resp.length > 0) {
        this.selectedCategory = resp[0].nombre_categoria;
      }
    });

  }
  
  ionViewDidEnter() {
  }
  
  ngAfterViewInit(): void {
  }


  verimg(folder: string, image: string): string {
    return this._gs.verImagen(folder, image);
  }

  onLoad(){
    setTimeout( () => { this.hasLoad = true; },1000);
  }

  swiperSlideChanged(e: any){
    console.log('change',e);
    this.selectedCategory  = this.slides[this.swiper?.nativeElement.swiper.activeIndex].nombre_categoria;
    
  }

  openCategoria(categoria : Categoria){
    this._r.setData(categoria,'categoria');
    this.router.navigate(['home/categoria']);
  }



  


}
