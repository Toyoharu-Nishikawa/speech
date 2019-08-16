//c-------------------------------------------
//      subroutine surftens(T,sigma)
//c-------------------------------------------
//
//c     input
//c         T:   temperature in K
//c     output
//c         sigma: surface tension of the interface between the liquid and vapor
//c                phases in N/m
//
//c     This subroutine is based on;
//c     "IAPWS Release on Surface Tension of Ordinary Water Substance",
//c     September 1994

  const Tc = 647.096 
  const Bb = 235.8e-3  
  const b  = -0.625  
  const mu = 1.256   
 
export const surftens = (T) => {
  const tau = 1 - T / Tc
  const sigma = Bb * Math.pow(tau, mu) * (1 + b * tau)

  return sigma
}
