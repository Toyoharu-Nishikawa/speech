/*******************************************************************/
/*  propPT.for
/*  (given P and T calculate properties of the regions 1, 2, 3, and 5) 
/*******************************************************************/

import {region_1} from "./IF97_1.mjs"
import {region_2} from "./IF97_2.mjs"
import {region_3} from "./IF97_3.mjs"
import {region_5} from "./IF97_5.mjs"
import {VPT_3} from "./Aux_3.mjs"
import {RegPT} from "./Reg_pt.mjs"

"use strict"

export const propPT = (P, T) => {
  const NP = 2
  const M = RegPT(P, T, NP)
  switch(M){
    case 1:{
      const state = region_1(P, T)
      return state
    }
    case 2 :{
      const state = region_2(P, T)
      return state
    }
    case 3 :{
      const v = VPT_3(P, T)
      const state = region_3(v, T)
      return state
    }
    case 5 :{
      const MM = 5
      const state = region_5(P, T)
      return state
    }
    default: {
      throw new RangeError("function propPT in propPT.mjs")
    }
  }
}

    
