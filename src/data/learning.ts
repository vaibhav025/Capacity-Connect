export const learningContent: Record<
  string,
  {
    outcome: string;
    modules: { title: string; body: string; takeaway: string }[];
  }
> = {
  radar: {
    outcome:
      "Explain radar observations and recognise when additional evidence is needed before a warning decision.",
    modules: [
      {
        title: "Radar principles and observation",
        body: "Weather radar transmits electromagnetic pulses and measures returned energy. Reflectivity depends on the size, number and properties of scatterers. A strong return is evidence to interpret alongside other observations, rather than a warning decision by itself.",
        takeaway:
          "Compare reflectivity with station observations and the broader weather situation.",
      },
      {
        title: "Doppler velocity interpretation",
        body: "Radial velocity describes motion toward or away from the radar along its beam. It does not represent the complete wind vector. Interpret the sign convention using the product legend and consider viewing geometry.",
        takeaway:
          "Always check the legend and beam geometry before interpreting motion.",
      },
      {
        title: "From observation to operational judgement",
        body: "A single radar scan is a snapshot. Compare successive scans, neighbouring observations and available guidance to understand evolution. Document uncertainty and follow your organisation’s approved operating procedure.",
        takeaway:
          "Use multiple observations and record the limitations of your interpretation.",
      },
    ],
  },
  satellite: {
    outcome:
      "Recognise the different information provided by satellite channels.",
    modules: [
      {
        title: "Visible imagery",
        body: "Visible imagery measures reflected sunlight. It is useful for cloud texture during daylight and depends on illumination.",
        takeaway: "Check observation time and illumination.",
      },
      {
        title: "Infrared imagery",
        body: "Thermal infrared observations provide brightness temperature information during day and night. Cloud-top temperature alone does not determine surface rainfall.",
        takeaway: "Avoid inferring rainfall from one channel alone.",
      },
      {
        title: "Combine observations",
        body: "Compare channels, image sequences and surface observations to form a more complete interpretation.",
        takeaway: "Document the evidence and uncertainty.",
      },
    ],
  },
  nwp: {
    outcome: "Explain uncertainty in numerical model guidance.",
    modules: [
      {
        title: "Initial conditions",
        body: "Numerical models start from an estimate of the atmospheric state. Gaps and errors in this estimate influence forecast evolution.",
        takeaway: "Check the model cycle and valid time.",
      },
      {
        title: "Resolution and limitations",
        body: "Model resolution limits the processes that can be represented explicitly. Local conditions may differ from grid-scale guidance.",
        takeaway: "Compare guidance with local observations.",
      },
      {
        title: "Ensemble guidance",
        body: "An ensemble explores a range of possible evolutions. Spread can help describe uncertainty but is not a guarantee that every outcome is represented.",
        takeaway: "Communicate a range and its limitations.",
      },
    ],
  },
  cyclone: {
    outcome: "Distinguish track, intensity and impact uncertainty.",
    modules: [
      {
        title: "Track and intensity",
        body: "Track and intensity are separate forecast dimensions. Changes in either can affect the interpretation of potential impacts.",
        takeaway: "Review both dimensions and their update times.",
      },
      {
        title: "Multiple hazards",
        body: "Cyclones can bring wind, rainfall and coastal hazards. Impacts depend on exposure and local conditions as well as the storm itself.",
        takeaway: "Consider more than one hazard.",
      },
      {
        title: "Communicating uncertainty",
        body: "Use approved official bulletins and procedures. Clearly distinguish observed conditions from forecast guidance and state the valid period.",
        takeaway: "Use current official guidance for operational decisions.",
      },
    ],
  },
};
