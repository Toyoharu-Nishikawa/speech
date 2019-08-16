//c-------------------------------------------
//      subroutine refract(T,rho,lambda,n)
//c-------------------------------------------
//
//c     input
//c         T:   temperature in K
//c         rho: density in kg/m^3
//c         lambda: wavelength in micron
//c     output
//c         n: refractive index with respect to vacuum
//
//c     This subroutine is based on;
//c     "Release on the Refractive Index of Ordinary Water and Steam
//c     as a Function of Wavelength, Temperature and Pressure",
//c     September 1991, revised September 1997


export const refract = (T, rho, lambda) => {
  const Tast   = 273.15
  const rhoast = 1000
  const lamast = 0.589
  const a0     = 0.244257733
  const a1     = 9.74634476e-3 
  const a2     = -3.73234996e-3 
  const a3     = 2.68678472e-4 
  const a4     = 1.58920570e-3 
  const a5     = 2.45934259e-3 
  const a6     = 0.900704920e0 
  const a7     = -1.66626219e-2 
  const lamxUV = 0.2292020 
  const lamxIR = 5.432937  

  const Tx = T / Tast
  const rhox = rho / rhoast
  const lamx = lambda / lamast
  const lamx2 = lamx * lamx

  const z = a0 + a1 * rhox + a2 * Tx + a3 * lamx2 * Tx + a4 / lamx2 +
   a5 / (lamx2 - lamxUV * lamxUV) + a6 / (lamx2 - lamxIR * lamxIR) +
   a7 * rhox * rhox
  const zz = z * rhox
  const n2 = (2 * zz + 1)/(1 - zz)
  const n  = Math.sqrt(n2)

  return n 
}
