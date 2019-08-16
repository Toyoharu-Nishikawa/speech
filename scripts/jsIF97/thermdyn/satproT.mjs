/*******************************************************************/
/* satproT.for                                                     */
/*  (given T calculates properties of saturated liquid and vapor)
/*******************************************************************/

import {region_1} from "./IF97_1.mjs"
import {region_2} from "./IF97_2.mjs"
import {region_3} from "./IF97_3.mjs"
import {Vsatl_3, Vsatg_3} from "./Aux_3.mjs"
import {PsatT} from "./IF97_Sat.mjs"

"use strict"

export const satproT = (T) => {
  /* input T: K  */
  
  
  if(T < 0){
    throw new RrangeError("Temperature is lower than the minimum temperature(273.15K)");
  } 
  if(T>647.096){
    throw new RangeError("Temperature is higher than the maximam pressure(critical povar)");
  }

  const P = PsatT(T)

  if(T <= 623.15){
    const state1 = region_1(P, T)
    const state2 = region_2(P, T)

    const lg = {
      l: state1,
      g: state2
    }

    return lg
  }
  else{
    const v1 = Vsatl_3(T)
    const v2 = Vsatg_3(T)
    const state1 = region_3(v1, T)
    const state2 = region_3(v2, T)
    const lg = {
      l: state1,
      g: state2
    }

    return lg
  }
}

    
