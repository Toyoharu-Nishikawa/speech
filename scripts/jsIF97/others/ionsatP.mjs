//      program ionsatP
//
//c  Link information
//c      ionsatP.for (this file)
//c      physdisp.for
//c      ionpro.for
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
//c     ion :   logarithm, in unit of 10, of ion product Kw/(mol kg^-1)^2
//c     pH :    pH = -(1/2)log10(Kw)
//c     v:      specific volume in m^3/kg
//c     rho:    density in kg/m^3

import {PsatT,TsatP} from '../thermdyn/IF97_Sat.mjs'
import {Vsatl_3, Vsatg_3} from "../thermdyn/Aux_3.mjs"
import {region_3} from '../thermdyn/IF97_3.mjs'
import {region_1} from "../thermdyn/IF97_1.mjs"
import {region_2} from "../thermdyn/IF97_2.mjs"
import {ionpro} from "./ionpro.mjs"


export const ionsatP = (P) => {
  const Tmin = 273.15
  const Pmin = PsatT(Tmin)

  if(P < Pmin){
      throw new RangeError('function dielsatp P is lower than the minimum pressure in dielsatP.mjs.')
  }
  if(P > 22.064){
      throw new RangeError('function dielsatp P is lower than the maximum pressure in dielsatP.mjs.')
  } 

  const T = TsatP(P)
  let state1
  let state2
  if (T <= 623.15){
    state1 = region_1(P, T)
    state2 = region_2(P, T)
  }
  else{
    const vl = Vsatl_3(T)
    const vg = Vsatg_3(T)
    state1 = region_3(vl, T)
    state2 = region_3(vg, T)
  }

  const v1 = state1.v 
  const v2 = state2.v 

  const rho1 = 1 / v1
  const rho2 = 1 / v2

  const ion1 = ionpro(T, rho1)
  const ion2 = ionpro(T,rho2)

  const pH1 = -0.5 * ion1
  const pH2 = -0.5 * ion2

  const pH = {
    l: pH1,
    g: pH2,
  }

  return pH
}
