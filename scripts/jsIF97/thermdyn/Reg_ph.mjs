/*******************************************************************/
/*RegPH(P, H, M)
/*  (given P and H find the region)
/*******************************************************************/

//     M= 1: region 1
//        2: region 2
//       12: wet steam region below 350 degC
//        5: region 5
//       30: region 3 above critical pressure
//       31: region 3 liquid
//       32: region 3 vapor
//       33: wet steam region above 350 degC
//        0: out of IF97

import {region_1} from "./IF97_1.mjs"
import {region_2} from "./IF97_2.mjs"
import {region_3} from "./IF97_3.mjs"
import {region_5} from "./IF97_5.mjs"
import {PsatT,TsatP} from './IF97_Sat.mjs'
import {Tb23P} from "./IF97_B23.mjs"
import {Vsatg_3,Vsatl_3} from "./Aux_3.mjs"

"use strict"

export const RegPH = (P, h) => {
  /* input P: MPa, H: kJ/kg */
  /* output M               */
  
  /* Test of maximum pressure */
  if(P > 100){
    const M = 0
    return M
  }
  /* Test below 10 MPa */  
  if(P <= 10){
    const Ttmp1 = 2273.15;
    const stateTmp1 = region_5(P, Ttmp1)
    const Htest1= stateTmp1.h
    if(h > Htest1){
      const M = 0
      return M 
    }

    const Ttmp2 = 1073.15
    const stateTmp2 = region_2(P, Ttmp2)
    const Htest2 = stateTmp2.h
    if(h > Htest2){
      const M = 5
      return M 
    }

    const Ttmp3 = TsatP(P)
    const stateTmp3 = region_2(P, Ttmp3)
    const Htest3 = stateTmp3.h
    if(h >= Htest3){
      const M = 2
      return M 
    }

    const stateTmp4 = region_1(P, Ttmp3)
    const Htest4 = stateTmp4.h        
    if(h > Htest4){
      const M = 12
      return M 
    }

    const Ttmp5 = 273.15
    const stateTmp5 = region_1(P, Ttmp5)
    const Htest5 = stateTmp5.h
    if(h >= Htest5){
      const M = 1
      return M 
    }
    else{
      const M = 0
      return M 
    }  
  }    

  /*Test below saturation pressure at 350 degC */
  const Ttmp6 = 623.15
  const Ptmp6 = PsatT(Ttmp6)
  if(P <= Ptmp6){
    const Ttmp7 = 1073.15;
    const stateTmp7 = region_2(P, Ttmp7)
    const Htest7 = stateTmp7.h        
    if(h > Htest7){
      const M = 0
      return M 
    }
    const Ttmp8 = TsatP(P)
    const stateTmp8 = region_2(P, Ttmp8)
    const Htest8 = stateTmp8.h       
    if(h >= Htest8){
      const M = 2
      return M 
    }

    const stateTmp9 = region_1(P, Ttmp8)
    const Htest9 = stateTmp9.h        
    if(h > Htest9){
      const M = 12
      return M
    }

    const Ttmp10 = 273.15
    const stateTmp10 = region_1(P, Ttmp10)
    const Htest10 = stateTmp10.h;        
    if(h >= Htest10){
      const M = 1
      return M 
    }
    else{
      const M = 0
      return M 
    }
  }
  
  /*Test below critical pressure*/
  const Ttmp11 = 647.096
  const Ptmp11 = PsatT(Ttmp11)
  if(P <= Ptmp11){
    const Ttmp12 = 1073.15
    const stateTmp12 = region_2(P, Ttmp12)
    const Htest12 = stateTmp12.h
    if(h > Htest12){
      const M = 0
      return M 
    }

    const Ttmp13 = Tb23P(P)
    const stateTmp13 = region_2(P, Ttmp13)
    const Htest13 = stateTmp13.h
    if(h >= Htest13){
      const M = 2
      return M 
    }
    const Ttmp14 = TsatP(P)
    const vg  = Vsatg_3(Ttmp14)
    const stateTmp14 = region_3(vg, Ttmp14)
    const Htest14 = stateTmp14.h
    if(h >= Htest14){
      const M = 32
      return M 
    }

    const vl = Vsatl_3(Ttmp14)
    const stateTmp15 = region_3(vl, Ttmp14)
    const Htest15 = stateTmp15.h
    if(h > Htest15){
      const M = 33
      return M 
    }

    const Ttmp16 = 623.15
    const stateTmp16 = region_1(P, Ttmp16)
    const Htest16 =stateTmp16.h
    if(h > Htest16){
      const M = 31
      return M 
    }

    const Ttmp17 = 273.15
    const stateTmp17 = region_1(P, Ttmp17)
    const Htest17 =stateTmp17.h
    if(h >= Htest17){
      const M = 1
      return M 
    }
    else{
      const M = 0
      return M
    }
  }

  /* Test above critical pressure   */
  const Ttmp18 = 1073.15
  const stateTmp18 = region_2(P, Ttmp18)
  const Htest18 = stateTmp18.h
  if(h > Htest18){
    const M = 0
    return M      
  }
  const Ttmp19 = Tb23P(P)
  const stateTmp19 = region_2(P, Ttmp19)
  const Htest19 = stateTmp19.h
  if(h >= Htest19){
    const M = 2
    return M      
  }

  const Ttmp20 = 623.15
  const stateTmp20 = region_1(P, Ttmp20)
  const Htest20 = stateTmp20.h
  if(h > Htest20){
      const M = 30
      return M      
  }
  const Ttmp21 = 273.15
  const stateTmp21 = region_1(P, Ttmp21)
  const Htest21 = stateTmp21.h
  if(h >= Htest21){
      const M = 1
      return M      
  }
  else{
      const M = 0
      return M      
  }
}

    
