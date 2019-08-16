//c-------------------------------------------
//      subroutine dielec(T,rho,epsiron)
//c-------------------------------------------
//
//c     input
//c         T:   temperature in K
//c         rho: density in kg/m^3
//c     output
//c         epsiron: static dielectric constant
//
//c     This subroutine is based on;
//c     "Release on the Static Dielectric Constant of Ordinary Water Substance
//c      for Temperatures from 238 K to 873 K and Pressures up to 1000 MPa",
//c     September 1997

  const Nh = []
  const ih = []
  const jh = []

  Nh[1]  =  0.978224486826  ;      ih[1]  =    1 ;  jh[1]  =  0.25 ; 
  Nh[2]  = -0.957771379375  ;      ih[2]  =    1 ;  jh[2]  =  1    ;
  Nh[3]  =  0.237511794148  ;      ih[3]  =    1 ;  jh[3]  =  2.5  ;
  Nh[4]  =  0.714692244396  ;      ih[4]  =    2 ;  jh[4]  =  1.5  ;
  Nh[5]  = -0.298217036956  ;      ih[5]  =    3 ;  jh[5]  =  1.5  ;
  Nh[6]  =  -0.108863472196 ;      ih[6]  =    3 ;  jh[6]  =  2.5  ;
  Nh[7]  =  0.949327488264e-1;     ih[7]  =    4 ;  jh[7]  =  2    ;
  Nh[8]  = -0.980469816509e-2;     ih[8]  =    5 ;  jh[8]  =  2    ;
  Nh[9]  =  0.165167634970e-4;     ih[9]  =    6 ;  jh[9]  =  5    ;
  Nh[10] =  0.937359795772e-4;     ih[10] =    7 ;  jh[10] =  0.5  ;
  Nh[11] = -0.123179218720e-9;     ih[11] =   10 ;  jh[11] =  10   ;
  Nh[12] =  0.196096504426e-2;               

  const rhoc = 322
  const Tc = 647.096
  const x = 299792458
  const eps0 = 1 / (4e-7 * 3.141592654 * x * x)
  const alpha = 1.636e-40
  const mu = 6.138e-30
  const k = 1.380658e-23
  const Na = 6.0221367e23
  const Mw = 0.018015268
  const rhomc = rhoc / Mw


export const dielec = (T, rho) => {

  const rhom = rho / Mw

  let g1 = 0

  for(let n=1;n<=11;n++){
    g1 += Nh[n] * Math.pow(rhom / rhomc, ih[n]) * Math.pow(Tc / T, jh[n])
  }
  const g = 1 + g1 + Nh[12] * (rhom / rhomc) * Math.pow(T / 228 - 1, -1.2)
      
  const A = Na * mu * mu * rhom * g / (eps0 * k * T)
  const B = Na * alpha * rhom /(3 * eps0)
  const epsiron = (1 + A + 5 * B 
             + Math.sqrt(9 + 2 * A + 18 * B + A * A + 10 * A * B + 9 * B * B))
             / (4 -4 * B)

  return epsiron
}
