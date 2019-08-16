/*******************************************************************/
/*viscos(T,rho,mu)
/*  (given T and rho calculate viscosity mu) 
/*conduc(T,rho,lambda)
/*  (given T and rho calculate thermal conductivity lambda)
/*******************************************************************/

"use strict"

  const Hi= []
  const Hij = []
  for(let i=0;i<6;i++){
    Hij[i]=[]
  }

  Hi[0] =  1.0 ;
  Hi[1] =  0.978197 ;
  Hi[2] =  0.579829 ;
  Hi[3] = -0.202354 ;

  Hij[0][0] =  0.5132047 ;
  Hij[1][0] =  0.3205656 ;
  Hij[2][0] =  0.0 ;
  Hij[3][0] =  0.0 ;
  Hij[4][0] = -0.7782567 ;
  Hij[5][0] =  0.1885447 ;

  Hij[0][1] =  0.2151778 ;
  Hij[1][1] =  0.7317883 ;
  Hij[2][1] =  1.241044 ;
  Hij[3][1] =  1.476783 ;
  Hij[4][1] =  0.0 ;
  Hij[5][1] =  0.0 ;

  Hij[0][2] = -0.2818107 ;
  Hij[1][2] = -1.070786 ;
  Hij[2][2] = -1.263184 ;
  Hij[3][2] =  0.0 ;
  Hij[4][2] =  0.0 ;
  Hij[5][2] =  0.0 ;

  Hij[0][3] =  0.1778064 ;
  Hij[1][3] =  0.4605040 ;
  Hij[2][3] =  0.2340379 ;
  Hij[3][3] = -0.4924179 ;
  Hij[4][3] =  0.0 ;
  Hij[5][3] =  0.0 ;

  Hij[0][4] = -0.04176610 ;
  Hij[1][4] =  0.0 ;
  Hij[2][4] =  0.0 ;
  Hij[3][4] =  0.1600435 ;
  Hij[4][4] =  0.0 ;
  Hij[5][4] =  0.0 ;

  Hij[0][5] =  0.0 ;
  Hij[1][5] = -0.01578386 ;
  Hij[2][5] =  0.0 ;
  Hij[3][5] =  0.0 ;
  Hij[4][5] =  0.0 ;
  Hij[5][5] =  0.0 ;

  Hij[0][6] =  0.0 ;
  Hij[1][6] =  0.0 ;
  Hij[2][6] =  0.0 ;
  Hij[3][6] = -0.003629481 ;
  Hij[4][6] =  0.0 ;
  Hij[5][6] =  0.0 ;  


export const viscos = (v, T) => {
//     input
//         T:   temperature in K
//         v:  specific volume m^3/kg
//     output
//         mu:  viscosity in Pa-s

//     This subroutine is based on;
//     "Revised Release on The IAPWS Formulation 1985 for the Viscosity
//      of Ordinary Water Substance", September 1997

  if(v<=0.0||T<=0.0){
    throw new RangeError("function viscos v<=0 T<=0 in transp.mjs")
  }
  
  const Tast = 647.226
  const rhoast = 317.763
  const muast = 55.071e-6
    
  const tauR =Tast / T
  const tauR1=tauR - 1.0
  const rho = 1 / v
  const rx = rho / rhoast
  const rx1 = rx - 1.0
  
  let vis0 = 0.0
  for(let i=0;i<=3;i++){
    vis0 += Hi[i] * Math.pow(tauR,i)
  }
  vis0 =Math.sqrt(T / Tast) / vis0
  
  let x=0.0;
  const tauR1Pow = []
  const rx1Pow = []

  for(let i=0;i<=5;i++){
    tauR1Pow[i] = Math.pow(tauR1,i)
  }
  for(let i=0;i<=6;i++){
    rx1Pow[i] = Math.pow(rx1,i)
  }

  for(let i=0;i<=5;i++){
    for(let j=0;j<=6;j++){
      x += Hij[i][j] * tauR1Pow[i] * rx1Pow[j]
    }
  }
  
  const mu= vis0 * Math.exp(rx*x) * muast
  
  return mu 
}

export const conduc = (v, T) => {
//     input
//          T: temperature in K
//          rho: density in kg/m^3
//     output
//          lambda: thermal conductivity in W/(m-K)

//     This subroutine is based on;
//     "Revised Release on The IAPS Formulation 1985 for the Thermal
//      Conductivity of Ordinary Water Substance", September 1998

  if(v<=0.0||T<=0.0){
    throw new RangeError("function viscos v<=0 T<=0 in transp.mjs")
  }

  const a = [];
  const b = [];
  const d = [];

  const rho= 1 / v
  
  const Tast = 647.26
  const rhoast = 317.7
    
  const B1   = -0.171587e+0  ;
  const B2   =  2.392190e+0  ;
  const C1   =  0.642857e+0  ;
  const C2   = -4.11717e+0   ;
  const C3   = -6.17937e+0   ;
  const C4   =  0.00308976e+0;
  const C5   =  0.0822994e+0 ;
  const C6   = 10.0932e+0    ;

  a[0] =  1.02811e-2   ;
  a[1] =  2.99621e-2   ;
  a[2] =  1.56146e-2   ;
  a[3] = -4.22464e-3   ;

  b[0] = -3.97070e-1   ;
  b[1] =  4.00302e-1   ;
  b[2] =  1.06e+0      ;

  d[1] =  7.01309e-2   ;
  d[2] =  1.1852e-2    ;
  d[3] =  1.69937e-3   ;
  d[4] = -1.020e+0     ;

  const tau=T/Tast
  const tauR=Tast/T
  const rx=rho/rhoast
  
  let con0=0.0
  for(let i=0;i<=3;i++){
    con0 += a[i]*Math.pow(tau,i)
  }
  con0 *= Math.sqrt(tau)
  const con1 = b[0] + b[1] * rx + b[2] * Math.exp(B1 * (rx + B2) * (rx + B2))
  
  const deltaT = Math.abs(tau-1.0) + C4
  const Q = 2.0 + C5 / Math.pow(deltaT,0.6)
  const R = Q + 1.0
  const S = tau >= 1.0 ? 1.0 / deltaT : C6 / Math.pow(deltaT, 0.6)
  
  const con21 = (d[1]*Math.pow(tauR,10)+d[2])*Math.pow(rx,1.8)*Math.exp(C1*(1.0-Math.pow(rx,2.8)))
  const con22 = d[3]*S*Math.pow(rx,Q)*Math.exp(Q/R*(1.0-Math.pow(rx,R)))
  const con23 = d[4]*Math.exp(C2*Math.pow(tau,1.5)+C3/Math.pow(rx,5))
  
  const lambda = con0 + con1 + con21 + con22 + con23
  
  return lambda 
}
    
