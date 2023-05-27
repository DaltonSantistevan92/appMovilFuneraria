import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { IonicSlides } from '@ionic/core';
import { CategoriasService } from '../services/categorias.service';
import { Router } from '@angular/router';
import { Categoria, Servicio } from '../interfaces/categoria-producto.interface';

@Component({
  selector: 'app-banner-plan',
  templateUrl: './banner-plan.component.html',
  styleUrls: ['./banner-plan.component.scss'],
})
export class BannerPlanComponent  implements OnInit {
  @ViewChild('swiper') swiper: ElementRef | undefined;//
  @Input() slides : Categoria [] = [];//
  swiperModules = [IonicSlides];//
  selectedCategory : string = '';//
  hasLoad : boolean = false;


  
  constructor(
    private _cs : CategoriasService,
    private router: Router
  ) { }

  ngOnInit() {}

  ngAfterViewInit(): void {//
    this._cs.$getObjSourceCategoriaServicio.subscribe( (resp) => { 
      if (resp.length > 0) {
        this.selectedCategory = resp[0].nombre_categoria;
      }
    }); 
  }

  swiperSlideChanged(e: any){
    console.log('change',e);
    this.selectedCategory  = this.slides[this.swiper?.nativeElement.swiper.activeIndex].nombre_categoria; 
  }

  onLoad(){
    setTimeout( () => {
      this.hasLoad = true;
    },1000)
  }


  openCategoriaServicio(categoria: Categoria){
    this.router.navigate(['home/categoria'], { state: { categoria: categoria } });
  }


}
