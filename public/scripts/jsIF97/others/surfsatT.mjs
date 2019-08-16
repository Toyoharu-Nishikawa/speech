//      program surfsatT
//
//c  Link information
//c      surfsatT.for (this file)
//c      physdisp.for
//c      surftens.for
//c    * aux_3.for
//c    * IF97_1.for
//c    * IF97_2.for
//c    * IF97_3.for
//c    * IF97_Sat.for
//c    * IF97_B23.for
//
//c    This program calls IF97 subroutines in the files marked with *.
//
//c     P:      pressure in MPa
//c     T:      temperature in K
//c     sigma: surface tension in N/m
//c     laplace: Laplace constant

import {PsatT,TsatP} from '../thermdyn/IF97_Sat.mjs'
import {Vsatl_3, Vsatg_3} from "../thermdyn/Aux_3.mjs"
import {region_3} from '../thermdyn/IF97_3.mjs'
import {region_1} from "../thermdyn/IF97_1.mjs"
import {region_2} from "../thermdyn/IF97_2.mjs"
import {surftens} from "./surftens.mjs"

const gc = 9.80665

export const surfsatT = (T) => { 
  if(T < 273.15){
    throw new RangeError("function dielsatp T<273.15 in dielsatT.mjs")
  }
  if(T > 647.096){
    throw new RangeError("function dielsatp T>647.096 in dielsatT.mjs")
  }
  
  const P =  PsatT(T)
  let state1
  let state2
  if(T <= 623.15){
    state1 = region_1(P, T)
    state2 = region_2(P, T)
  }
  else{
    const vl = Vsatl_3(T)
    const vg = Vsatg_3(T)
    stete1 = region_3(vl, T)
    state2 = region_3(vg, T)
  } 
  const sigma =  surftens(T)

  const v1 = state1.v 
  const v2 = state2.v 

  const rho1 = 1 / v1
  const rho2 = 1 / v2

  const laplace = rho1 > rho2 ? Math.sqrt(sigma / (gc * (rho1 - rho2))) : 0

  const obj = {
    sigma: sigma,
    laplace: laplace,
  }
  return obj
}
 
