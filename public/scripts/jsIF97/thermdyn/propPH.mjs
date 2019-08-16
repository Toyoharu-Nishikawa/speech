/*******************************************************************/
/*  propPH.for
/*(given P and H calculate properties of the regions 1, 2, 3, 5, 
/* and wet steam region) 
/*******************************************************************/

import {region_1} from "./IF97_1.mjs"
import {region_2} from "./IF97_2.mjs"
import {region_3} from "./IF97_3.mjs"
import {TsatP} from './IF97_Sat.mjs'
import {ZPH_1} from "./Aux_1.mjs"
import {ZPH_2} from "./Aux_2.mjs"
import {Vsatl_3, Vsatg_3,ZPH_30, ZPH_31 ,ZPH_32} from "./Aux_3.mjs"
import {ZPH_5} from "./Aux_5.mjs"
import {RegPH} from "./Reg_ph.mjs"
import {propPS} from "./propPS.mjs"

"use strict"

export const propPH = (P, h) => {

  const M = RegPH(P, h) 
  switch(M){
    case 1: {
      const state = ZPH_1(P, h)
      state.x = 0
      return state
    }
    case 2 : {
      const state = ZPH_2(P, h)
      const T = state.T
      state.x =  (T >= 647.096 && P >= 22.064) ? -1 :1
      return state
    }
    case 30 : {
      const state = ZPH_30(P, h)
      state.x = 2   
      return state
    }
    case 31 : {
      const state = ZPH_31(P, h)
      state.x = 0.0   
      return state
    }
    case 32 : {
      const state = ZPH_32(P, h)
      state.x = 1.0    
      return state
    }
    case 5 : {
      const state = ZPH_5(P, h)
      state.x = 1.0    
      return state
    }
    case 12 : {
      const T = TsatP(P)
      const state1 = region_1(P, T)
      const state2 = region_2(P, T)

      const x = (h - state1.h) / (state2.h - state1.h)
      const g = state2.g * x + state1.g * (1.0 - x)
      const u = state2.u * x + state1.u * (1.0 - x)
      const v = state2.v * x + state1.v * (1.0 - x)
      const s = state2.s * x + state1.s * (1.0  -x) 
      const cp = -1 

      const stateTmp = propPS(P, s)
      const w = stateTmp.w 

      const state = {
        g: g,
        u: u,
        v: v,
        P: P,
        T: T,
        h: h,
        s: s,
        cp: cp,
        w: w,
        x: x,
        MM: 4,
      }
      return state
    }
    case 33 : {
      const T = TsatP(P)

      const v1 = Vsatl_3(T)
      const v2 = Vsatg_3(T)
      const state1 = region_3(v1, T)
      const state2 = region_3(v2, T)

      const x = (h - state1.h) / (state2.h - state1.h)
      const g = state2.g * x + state1.g * (1.0 - x)
      const u = state2.u * x + state1.u * (1.0 - x)
      const v = state2.v * x + state1.v * (1.0 - x)
      const s = state2.s * x + state1.s * (1.0 - x)    
      const cp = -1

      const stateTmp = propPS(P, s)
      const w = stateTmp.w 
      const state = {
        g: g,
        u: u,
        v: v,
        P: P,
        T: T,
        h: h,
        s: s,
        cp: cp,
        w: w,
        x: x,
        MM: 4,
      }
      return state

    }
    default :{
      throw new RangeError("function propPH MM in propPH.mjs")
    }
  }
}

