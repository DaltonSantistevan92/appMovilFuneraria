import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { IonicSlides } from '@ionic/core';
import { SwiperOptions } from 'swiper';
import { Categoria } from '../interfaces/categoria-producto.interface';
import { CategoriasService } from '../services/categorias.service';
import { Router } from '@angular/router';


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
    private router: Router
  ) { }

  ngOnInit() {
   
    
  }

  ngAfterViewInit(): void {//
    this._cs.$getObjSourceCategoria.subscribe( (resp) => {
      if (resp.length > 0) {
        this.selectedCategory = resp[0].nombre_categoria;
      }
    }); 
  }

  onLoad(){
    setTimeout( () => {
      this.hasLoad = true;
    },1000)
  }

  swiperSlideChanged(e: any){
    console.log('change',e);
    this.selectedCategory  = this.slides[this.swiper?.nativeElement.swiper.activeIndex].nombre_categoria;
    
  }

  openCategoria(categoria : Categoria){
    this.router.navigate(['home/categoria'], { state: { categoria: categoria } });
  }

  


}
