/*******************************************************************/
/* satproP.for                                                     */
/*  (given P calculates properties of saturated liquid and vapor)
/*******************************************************************/

import {region_1} from "./IF97_1.mjs"
import {region_2} from "./IF97_2.mjs"
import {region_3} from "./IF97_3.mjs"
import {Vsatl_3, Vsatg_3} from "./Aux_3.mjs"
import {TsatP, PsatT} from "./IF97_Sat.mjs"

"use strict"

export const satproP = (P) => {
  /* input P: MPa  */
  /* output {l: state, g: state} */
  
  const Tmin = 273.15; 
  const Pmin = PsatT(Tmin)

  if(P <= 0){
    throw new RangeError("Pressure is lower than zero")
  }
  if(P < Pmin){
    throw new RangeError("Pressure is lower than the minimum pressure");
  }
  if(P > 22.064){
    throw new RangeError("Pressure is higher than the maximam pressure(critical povar)");
  }
  const T = TsatP(P)

  if(T <= 623.15){    
    const state1 = region_1(P, T)
    const state2 = region_2(P, T)

    const lg = {
      l : state1,
      g : state2,
    }

    return lg
  }
  else{
    const v1 = Vsatl_3(T)
    const v2 = Vsatg_3(T)

    const state1 = region_3(v1, T)
    const state2 = region_3(v2, T)

    const lg = {
      l : state1,
      g : state2,
    }

    return lg
  }
}

    
