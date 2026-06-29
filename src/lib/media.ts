/**
 * Media manifest. `brand/*` are AI-generated abstract layers (no humans - the
 * only place AI is allowed). `media/*` atmospherics are place/no-people shots
 * used as tasteful editorial backdrops. Every identifiable-human slot stays a
 * crafted placeholder for the real commissioned shoot (see MediaFrame).
 */
export const media = {
  // Landing hero: abstract dark liquid-chrome (dark-left for legibility). The
  // WebGL current screen-blends over this, so the plate is the guaranteed base.
  heroCool: { src: "/brand/hero-cool.webp", poster: "/brand/hero-cool-poster.webp", blur: "data:image/webp;base64,UklGRm4AAABXRUJQVlA4IGIAAACQAwCdASoYAAoAPu1krU2ppaSiMAgBMB2JTK3JaPJtP1jtTYAAAP7wdd4bAdl8c0FPOflqlhXwwyQplXAIqH5UShYFfw9g2nRoIydR8tRBJKa5Aie/bmfdCRmEjiAMz9AAAA==" },
  currentCool: { src: "/brand/current-cool.webp", poster: "/brand/current-cool-poster.webp", blur: "data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAABQBACdASoYAAoAPu1iqU2ppaQiMAgBMB2JZgCdMoR3ACaYuHi269gpGhIAAP7xcJPrzg5/lUgeAf3yjqkVeoHwLFZjiaq3JiOm2DOzslq8jALSQ+RIc00YEzx9xAMDavs6RlY6+PDA79YiAAA=" },
  currentWarm: { src: "/brand/current-warm.webp", blur: "data:image/webp;base64,UklGRqgAAABXRUJQVlA4IJwAAAAQBACdASoYAA0APu1orU6ppiSiMAgBMB2JYgCdAGt/gHE73FfZffdXYAD+/E0PTIpBM/xTl25dznDrpnFEOO1UcZ35vgVg/V29vHABN/Z3UMaQV8wYmarHiGD3nc2YaMr14x55wJ4kZQHHLvM8PGWMCfmEpBRiAdivZuaz6IKyYwmcVzgnqr+gp53Xq1yF/eXFlUfLZfxyiFkEAAA=" },
  currentFork: { src: "/brand/current-fork.webp", poster: "/brand/current-fork-poster.webp", blur: "data:image/webp;base64,UklGRqIAAABXRUJQVlA4IJYAAABQBACdASoYAAoAPu1kqU2ppaOiMAgBMB2JZgCdACF5/ApDfLzP7ykU1WgAAP70MGW8B5PFUIsI7GbL0auuDR5SphAv0xJqZvfpMlvDDOS86FK1amfvEpzX9bsuYVQA0JXF3W/jG3rgCz5uzjfGg70QZw37W1CbpvZQiNCGXHW7/8Fn8OKPClzI5ksA8yVCpUDM2g04AAA=" },
  halifaxStreet: { src: "/media/halifax-street.webp", blur: "data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAADQAwCdASoYABAAPu1iqk2ppaQiMAgBMB2JYwCw7BuecUPjzqmcyTAA/t2RZkRbstuc25gTMHI2KtN3Xl5YypVafG0CpR4V2N+8o6DH/+tXlt6G7/Jpxd5ZjPmpB3ZkfpqA9XlFZKffLOPwAAA=" },
  halifaxHarbour: { src: "/media/halifax-harbour.webp", blur: "data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAACQAwCdASoYAAoAPu1oqk6ppiQiMAgBMB2JZQCdAB4S6DgmW5dAAP7vS93DO4N+DMYd3o99ggyzYLXJ79a8l6DAkK8XXIRW3GkIQDtiF2HF/jGp6y1NgIxXFrMjAKAA" },
  officeInterior: { src: "/media/office-interior.webp", blur: "data:image/webp;base64,UklGRswAAABXRUJQVlA4IMAAAADwBACdASoYABAAPu1iqU2ppaOiMAgBMB2JZACdMoJYAAr1cGvOCZlOvAUmvjuvHwAA/dvaUUJv8pZ+mgAs+HlrKUWsp68Xgwb4+ji1k5s0XKfVlucFHeoEQFgqGsxtPViehidQiEUTmWrr7rFbM4BOaLcAhvKRcNSK1xcQPyjsr1iYf7QcRVptIVtz/jEvP1LOuYqV9cAW9ldTcs1DeYdF/2I5Vd4DkKV5XTkQdznlaq+QpLziSQm+RuZHb8BFwAA=" },

  // Real, client-provided media (no AI): identifiable humans, the actual team.
  teamGroup: { src: "/real/team-group.webp", blur: "data:image/webp;base64,UklGRvYAAABXRUJQVlA4IOoAAADQBQCdASoYABgAPu1ur1KppiQiqAgBMB2JQBOgtoram0eEXUD/SPr1HH3/0f4N9fS8nTFaEhxgAP2frqvVlXhrWiGB5rwTeGbS2N3Zwk6phDkLaSy0LCvaFGfMpn/jZ8i1oXpB+iVkacSvhoH4D5CfebJ1QBQ2Ku8vdraYbq6HAylt9PpaS86MS3fAjAvU/gCU1B6gc61cRPajNKPbLeVw3tjZA6JLZJ3YNQKuheV/almp//ikDRlHoTJ8op3+kBgoxEPNaan6D/gqw1mXwluqHgiYAiysNgAjiCNiKv3lN19JQAMZ0+WAAAA=" },
  bernie: { src: "/real/bernie.webp", blur: "data:image/webp;base64,UklGRgIBAABXRUJQVlA4IPYAAACQBQCdASoYABgAPu1qrlCppaQiqAqpMB2JZgC+SYzQb1bLWV8Fe9a4aZ/fFzgNC/rMK6yNUAD42f8Gxas+LLN4bQKo3V6R5vVaU4XpzCkNI41UeLmOMWfsGxaVvzu4O/PhNf2nEl9Mc24p/6hR//byeExnlLOQzLVwQxEpF50vGPRNFh04HoxJenXktoV6R7BSuwTHnrHwtljp8m0LYsh5/kuZOEMYfS0AjOHsZIVOx3uPZXQ0gb4+RB14xTSRp8rXa3hJlnv2R9FVFDpBq6V+Vi/bPkwCYqHb5K89Acn6ZGMzIP6Rj7BRZDwEz8cYuZHrYeB5gAA=" },
  neely: { src: "/real/neely.webp", blur: "data:image/webp;base64,UklGRuIAAABXRUJQVlA4INYAAADwBQCdASoYABgAPu1eq02ppSQiMBgMATAdiWwAvoFA3mvlYst4KCcvGzNmhmx0554icdt/gY/VAAD+9NfviapkgUMO1/yxdm6dEzEwg7gzeSiLyQEY4gI5kgEEdJommpIWn2EPj3TSy3jx5YQZHsnnx9xrD1iV74N41Hu5gXHVpd4eP33FSw5hkry3MHufvx2eojhffNI9J1OGoGPkjdvNXTYlB1FyZ/Y9AMvY8T/RTnYLab9TmFDzEHR2RzGJ0/37rKOR0JaTpOMl1bEFbqqc+9RGQAAA" },
  ahnaf: { src: "/real/ahnaf.webp", blur: "data:image/webp;base64,UklGRtgAAABXRUJQVlA4IMwAAADwBQCdASoYABgAPu1ur1IppiQiqAgBMB2JQBWEKCQYYYAP2Nnh9VMaBPECUhAzkRq0hhClVNNTKAD3z+QQatTU5dsxuhdXAD1lKQP41j31RrTX9Mj5LOaH1Y0lTrjdC4A7/buN3lhd/SDPiiq4e3dd5tCvmrusRjQ/JIPPBiQKG4wr5NNU3p0RSHFYbEwpBJCuS537/i70aM/u+yhqI5g/Gp/RLGID3g6LISgdV2wtKAfGQLf73KX21npeOfSlxKRjg3cIUfgxYzCC8AA=" },

  // AI-GENERATED FILLER (Higgsfield) — realistic placeholders for the people slots.
  // Swap each for the real commissioned shoot before launch (these are mockup-only).
  repField: { src: "/media/rep-field.webp", blur: "data:image/webp;base64,UklGRm4AAABXRUJQVlA4IGIAAAAwAgCdASoQAAwAA4BaJQBOgMX1yZzr00N7AADOATjvdn1RvJjI7GifXqJ/Zxg/Qh6F56EmrnO2H1SGv1V7lrlG7NTPXe34W8y5QN3t8ibOV+RXtumLZuF6ytHsCfUVQW/gAA==" },
  momentHuddle: { src: "/real/moment-huddle.webp", blur: "data:image/webp;base64,UklGRpYAAABXRUJQVlA4IIoAAAAQBACdASoQABUAPu1iqU2ppaOiMAgBMB2JQAB8vT+Whe+WFoIcuJ+BwAD+eKAbbVgRzfOHGJt6aHs6GhUPK6QOmUZENdqNc4qvy68PNUc6j03UDfN04U1lIZ40DvqwQq6iAqPrRO/9ziWfd/GsVz825IdiXkaPOd7S/8dXvAHqaeshLdw4PZzpXAA=" },
  momentClose: { src: "/real/moment-close.webp", blur: "data:image/webp;base64,UklGRpQAAABXRUJQVlA4IIgAAAAQBACdASoQABUAPu1iqU2ppaOiMAgBMB2JQBTisYxbD2CW0WBulIPLEAD+ccgWslYTaqNMlW9CzwFwI8ZJlcYVTljuS7OUu7InJwJ2lsUyGH1KlYVSkBN0t6b2G132fOlbM1XRGPpCy8Er9hv4Yos1NbedEeBMt3cHkHSuR/Jvr7cgoFHRQAAA" },
  momentBoard: { src: "/real/moment-board.webp", blur: "data:image/webp;base64,UklGRpAAAABXRUJQVlA4IIQAAAAQBACdASoQABUAPu1iqU2ppaOiMAgBMB2JYwCdABuyOlfEU9+B0dnd4AD+JSshzje4X2fAhw9y39ZRZIGvz7HV73QCrb+lRB1ivGWmLxZmDLHZSs0f0HbHJX5G4ol5kHkvVqPPVuluiN202kCucKhZc/mcOY4FJutFNFUqusxCwNmQAAA=" },
  momentPromo: { src: "/real/moment-promo.webp", blur: "data:image/webp;base64,UklGRpgAAABXRUJQVlA4IIwAAADwAwCdASoQABUAPu1iqU2ppaOiMAgBMB2JQBOmUABRzmYrQCbwme7AAP5Kcwr+20LqM7l9VTfciS/EjfVrJKa82qjat6CvUWR270xD5DOa45RZ0FVtrydJ2Bp4BJpQOmFUXOAuVaWqIV3g/Wh0dazhezUYn1lyCp/rICBoBFPdnJt18SciXCZRlwAAAA==" },

  // AI filler, batch 2 (Higgsfield) — Partner coverage + Careers slots. Swap before launch.
  halifaxBright: { src: "/media/halifax-bright.webp", blur: "data:image/webp;base64,UklGRoAAAABXRUJQVlA4IHQAAABwBACdASoQABUAPu1iqU2ppaOiMAgBMB2JagCdMoADfz+xnto0MoBT6OazUAD0cFK9sY3eUIiwnlDy3CC+gpXUaKX9S7oEaW2Lkpxs8EI6qd2G5s8Sx6OBKebZnllZZfjNiBxe+JnPO1/dZ+A02YDiQ6wAAA==" },
  valueEnergy: { src: "/media/value-energy.webp", blur: "data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAABQAgCdASoQAAkAA4BaJZACdAYuba4sSwOGtgAA/tyZV3lCZ8SZfC8Nh/xnoIqkWVhlDoYosvjZ8MFkRjbCq6NxDuDguIVA4Ybv0uepyOcw1h79oKD6UCekKDAAXbIAAAA=" },
  valueGrowth: { src: "/media/value-growth.webp", blur: "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAADQAQCdASoQAAkAA4BaJQBOgBosw8cFCAD+iTcxwD20IyQQ5vxNWlU0C00D42O2SA8q0wPxtmY7GdC5hea2hSdc6MSRq7i+tTzamHmJcYDElgAA" },
  valueIntegrity: { src: "/media/value-integrity.webp", blur: "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAACwAQCdASoQAAkAA4BaJZQC7ADAFp+AAP1rfMR1QbD3yptvFws4bC3lYm+pKUbeG9fsygK9CVjSni0WeGzvvd99SkBQRBbqC0BVB6INh2HQgAAA" },
  dilMorning: { src: "/media/dil-morning.webp", blur: "data:image/webp;base64,UklGRnYAAABXRUJQVlA4IGoAAAAwAgCdASoQAAwAA4BaJYwCdADjY7gA0oHYAAD+6VMsZfhfzzeZz7ITRumJlXMi9kW/cYHI+oSYZUTPgBPZaFESp+G3FMkdeueP6imWyps3xIUCTY4Nnsptk6cd8YCPgq7aoInULPlFQLAA" },
  dilAfternoon: { src: "/media/dil-afternoon.webp", blur: "data:image/webp;base64,UklGRm4AAABXRUJQVlA4IGIAAAAwAgCdASoQAAwAA4BaJYwCdAYv1Qv1HPh+gAD7h1UAzImCQyyMV6nvxKR50v3Z/ly6CbPvpmg+B9TQHFjQeb21wOE2XzYI1hwM5Fxr7VfWYUVKpz50C0mqckDpYF0bqpMAAA==" },
  dilEvening: { src: "/media/dil-evening.webp", blur: "data:image/webp;base64,UklGRm4AAABXRUJQVlA4IGIAAAAwAgCdASoQAAwAA4BaJYgCdAYuR2wod25RAAD+7vGAeOibT6fFGU16VGGvxxpRdPrdVIc2FcFqxJACcPQ0687benVVAHwsSnxsfJptiADJyFv4U57ScbZ+BMiLhURNWQhgAA==" },
  ig1: { src: "/media/ig-1.webp", blur: "data:image/webp;base64,UklGRm4AAABXRUJQVlA4IGIAAADwAQCdASoQABAAA4BaJYgCdADgx3AmtDAA/dVYsFH/+WXMm/t0ySzsFtFYwSemO4MeyAsTJf+yd7TENQkNCuy1fdXnDC4mvbbPe7Wlm5VSgqZriiZmTV8VQ11Ca4CEncAAAA==" },
  ig2: { src: "/media/ig-2.webp", blur: "data:image/webp;base64,UklGRoIAAABXRUJQVlA4IHYAAABQAgCdASoQABAAA4BaJZgCdAYr7y9WwWF8NjgA/VBNAUJTdfUo4lF8HgNrKrmWImuXbgTBJkOdi4rMWVcD9Q3jaVPsXr2AKvn9sAwkWscNjnTa+aZFFyydQdGQ8IRYXtrMq1XTutMoFUUOzuXULYOqvgAgQAAA" },
  ig3: { src: "/media/ig-3.webp", blur: "data:image/webp;base64,UklGRnQAAABXRUJQVlA4IGgAAAAQAgCdASoQABAAA4BaJZACdADPCUplTsWAAP2Kz8JpVfkJX56qTKKe8bmM93WavEXmbuMPxSO8hLW4hlM+8K+sX+oDPeP+zo8g4yFuzItrHZNqG9Rg84O/+217GDpGxigiM+F0ybwAAA==" },
} as const;
