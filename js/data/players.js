/**
 * BAZNAS BADMINTON CLUB (BBC)
 * Player Roster Data
 * Fields: achievements[], isPlayerOfTheMonth, stats { attendance, matches, wins, losses }
 */
const players = [
    {
        id: "ikrom",
        name: "Ikrom",
        gender: "male",
        division: "Service Development",
        isPlayerOfTheMonth: true,
        stats: {
            attendance: 24,
            matches: 30,
            wins: 26,
            losses: 4
        },
        achievements: [
            "Juara 1 Internal Cup 2025",
            "Top Scorer Sparring BAZNAS-BPS 2025"
        ],
        gallery: [
            {
                id: "gal-ikrom-1",
                url: "https://images.unsplash.com/photo-1521537634581-0dced2efa2a3?auto=format&fit=crop&q=80&w=800",
                caption: "Drill footwork & net play intensif di GOR BAZNAS"
            },
            {
                id: "gal-ikrom-2",
                url: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800",
                caption: "Selebrasi podium Juara 1 Internal Cup 2025"
            },
            {
                id: "gal-ikrom-3",
                url: "https://images.unsplash.com/photo-1613918108466-292b78a8ef95?auto=format&fit=crop&q=80&w=800",
                caption: "Aksi jump smash mematikan babak semifinal"
            }
        ],
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
        cardBg: "var(--color-primary-light)"
    },
    {
        id: "farhan",
        name: "Farhan Maulana",
        gender: "male",
        division: "Pendistribusian Zakat",
        isPlayerOfTheMonth: false,
        stats: {
            attendance: 20,
            matches: 28,
            wins: 21,
            losses: 7
        },
        achievements: [
            "Semifinalis Sparring vs BPS DKI 2025",
            "Best Smash Award Six Wonder Cup 2025"
        ],
        gallery: [
            {
                id: "gal-farhan-1",
                url: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&q=80&w=800",
                caption: "Sesi pemanasan smash keras sebelum laga"
            },
            {
                id: "gal-farhan-2",
                url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800",
                caption: "Momen sengit rubber game vs BPS DKI"
            }
        ],
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
        cardBg: "var(--color-yellow)"
    },
    {
        id: "siti",
        name: "Siti Rahmawati",
        gender: "female",
        division: "Komunikasi Publik",
        isPlayerOfTheMonth: false,
        stats: {
            attendance: 22,
            matches: 25,
            wins: 19,
            losses: 6
        },
        achievements: [
            "Juara 2 Ganda Campuran BBC 2026",
            "Most Consistent Player 2025"
        ],
        gallery: [
            {
                id: "gal-siti-1",
                url: "https://images.unsplash.com/photo-1521537634581-0dced2efa2a3?auto=format&fit=crop&q=80&w=800",
                caption: "Penempatan bola silang akurat di garis ganda"
            },
            {
                id: "gal-siti-2",
                url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800",
                caption: "Penerimaan medali penghargaan atlet terdisiplin"
            }
        ],
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600",
        cardBg: "var(--color-coral)"
    },
    {
        id: "dimas",
        name: "Dimas Anggoro",
        gender: "male",
        division: "IT & Transformasi Digital",
        isPlayerOfTheMonth: false,
        stats: {
            attendance: 18,
            matches: 22,
            wins: 15,
            losses: 7
        },
        achievements: [
            "Best Defense Player BBC 2025",
            "Juara 3 Tunggal Putra Internal Cup 2024"
        ],
        gallery: [
            {
                id: "gal-dimas-1",
                url: "https://images.unsplash.com/photo-1613918108466-292b78a8ef95?auto=format&fit=crop&q=80&w=800",
                caption: "Latihan kelincahan dan shadow footwork"
            }
        ],
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600",
        cardBg: "var(--color-sky)"
    },
    {
        id: "anisa",
        name: "Anisa Nuraini",
        gender: "female",
        division: "Keuangan & Akuntansi",
        isPlayerOfTheMonth: true,
        stats: {
            attendance: 26,
            matches: 29,
            wins: 25,
            losses: 4
        },
        achievements: [
            "Juara 1 Ganda Putri Six Wonder Cup 2025",
            "Juara 2 Ganda Putri Internal Cup 2024",
            "MVP Sparring Putri 2025"
        ],
        gallery: [
            {
                id: "gal-anisa-1",
                url: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800",
                caption: "Trofi Juara 1 Ganda Putri Six Wonder Cup 2025"
            },
            {
                id: "gal-anisa-2",
                url: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&q=80&w=800",
                caption: "Service flick mengecoh lawan di game penentuan"
            }
        ],
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600",
        cardBg: "var(--color-yellow)"
    },
    {
        id: "rezky",
        name: "Rezky Pratama",
        gender: "male",
        division: "SDM & Umum",
        isPlayerOfTheMonth: false,
        stats: {
            attendance: 21,
            matches: 24,
            wins: 17,
            losses: 7
        },
        achievements: [
            "Kapten Tim BBC Fun Games 2025",
            "Best Team Player Award 2024"
        ],
        gallery: [
            {
                id: "gal-rezky-1",
                url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800",
                caption: "Koordinasi pertahanan rally panjang di lapangan"
            }
        ],
        image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=600",
        cardBg: "var(--color-primary-light)"
    },
    {
        id: "afif",
        name: "Afif",
        gender: "male",
        division: "BAZNAS RI",
        isPlayerOfTheMonth: false,
        stats: {
            attendance: 0,
            matches: 0,
            wins: 0,
            losses: 0
        },
        achievements: [],
        image: "https://lh3.googleusercontent.com/sitesv/AG8ngQViPAO4oFHWHTTmEMdIvgT3XSuAhECrOKhBOGVb71_12bhEDXtIiEVrBmiOIYpK4Sfi_63nza_MaaGQH4ikJar49Ss6X5PvAFTj7aDMT1TIaLHLt1Mdp_VWOD7A_BU6rANpSPkC0kxFWPiaGPyOOYlefPqYxPAST4s24ByUNrMcsH1K4AMxxl2l0s2QeyqiVMkkH_NAmYpS99y0HWpYIU_sf6IG_GR_ZN9Q1rhX=w1280",
        cardBg: "var(--color-primary-light)"
    },
    {
        id: "aka",
        name: "AKA",
        gender: "male",
        division: "BAZNAS RI",
        isPlayerOfTheMonth: false,
        stats: {
            attendance: 0,
            matches: 0,
            wins: 0,
            losses: 0
        },
        achievements: [],
        image: "https://lh3.googleusercontent.com/sitesv/AG8ngQViPAO4oFHWHTTmEMdIvgT3XSuAhECrOKhBOGVb71_12bhEDXtIiEVrBmiOIYpK4Sfi_63nza_MaaGQH4ikJar49Ss6X5PvAFTj7aDMT1TIaLHLt1Mdp_VWOD7A_BU6rANpSPkC0kxFWPiaGPyOOYlefPqYxPAST4s24ByUNrMcsH1K4AMxxl2l0s2QeyqiVMkkH_NAmYpS99y0HWpYIU_sf6IG_GR_ZN9Q1rhX=w1280",
        cardBg: "var(--color-yellow)"
    },
    {
        id: "arifin",
        name: "Arifin",
        gender: "male",
        division: "BAZNAS RI",
        isPlayerOfTheMonth: false,
        stats: {
            attendance: 0,
            matches: 0,
            wins: 0,
            losses: 0
        },
        achievements: [],
        image: "https://lh3.googleusercontent.com/sitesv/AG8ngQVF1BPF0FowAtS_KjKImz2DUWwOfyg9C_TM5GEuok8qgiGO5xUbwp2JpoBBVlu8FMnC3vPD5D7imSXROc3v66q9jZvmPVkoA6erTkpUJDGk8LrdL_GuhXkKDFL9vCXDMYKilpA2UK5vqlolpTu6Jj1Vbj31EAliqYuxxFzbin7WSTHOZYchBs27yF4RezZ7Za_tCkwFaFfOuThlV5x-1qa1a603xKe0_uh3kb4RSE4=w1280",
        cardBg: "var(--color-sky)"
    },
    {
        id: "irsyad",
        name: "Irsyad",
        gender: "male",
        division: "BAZNAS RI",
        isPlayerOfTheMonth: false,
        stats: {
            attendance: 0,
            matches: 0,
            wins: 0,
            losses: 0
        },
        achievements: [],
        image: "https://lh3.googleusercontent.com/sitesv/AG8ngQXNRP4dwF6g-4uNwtOTvlz9jgYQgnVXZobmyLLKEMB2Rlywr_cc_qSmXq3k-ypaijtMk31dE52qSP1gvxmylr8OhZ1-8ApTwP4b1uWw2AqaJIaOReq5foqUfQkyFsK5fIeXZlhadEZX5F7MEvuc9OxtURxvWvTlFZOUD-87ca4Q7zxb4qHFhWuU6WEQ9Ch4VfQli48KzhfjUj642ViUJ1p9Zvs-KSIQgr9rceV5wOQ=w1280",
        cardBg: "var(--color-coral)"
    },
    {
        id: "mohan",
        name: "Mohan",
        gender: "male",
        division: "BAZNAS RI",
        isPlayerOfTheMonth: false,
        stats: {
            attendance: 0,
            matches: 0,
            wins: 0,
            losses: 0
        },
        achievements: [],
        image: "https://lh3.googleusercontent.com/sitesv/AG8ngQXNRP4dwF6g-4uNwtOTvlz9jgYQgnVXZobmyLLKEMB2Rlywr_cc_qSmXq3k-ypaijtMk31dE52qSP1gvxmylr8OhZ1-8ApTwP4b1uWw2AqaJIaOReq5foqUfQkyFsK5fIeXZlhadEZX5F7MEvuc9OxtURxvWvTlFZOUD-87ca4Q7zxb4qHFhWuU6WEQ9Ch4VfQli48KzhfjUj642ViUJ1p9Zvs-KSIQgr9rceV5wOQ=w1280",
        cardBg: "var(--color-primary-light)"
    },
    {
        id: "arief",
        name: "Arief",
        gender: "male",
        division: "BAZNAS RI",
        isPlayerOfTheMonth: false,
        stats: {
            attendance: 0,
            matches: 0,
            wins: 0,
            losses: 0
        },
        achievements: [],
        image: "https://lh3.googleusercontent.com/sitesv/AG8ngQWNNuxYmiXWrPGpM3k0UNt_etHftcLG9qXR2IqiSP_LXsmCQvCDRmNwUcnDTXdcYnp3-VIJlMGlEd-IQfCy4QpR0TNFAzdmwi2oZRmBZVfXNLWshpk5GVepPIA-rKKiGzbopKlerfNttllVOGG1Zw1xEVmMfvCl5qKO5t_1oQ_7UEZ6-52CInk7uEKqqJKoxU3lmGdCsh281QOv3hcdoRgKO6uSvGLcOaHX0UBpDLs=w1280",
        cardBg: "var(--color-yellow)"
    },
    {
        id: "deddy",
        name: "Deddy",
        gender: "male",
        division: "BAZNAS RI",
        isPlayerOfTheMonth: false,
        stats: {
            attendance: 0,
            matches: 0,
            wins: 0,
            losses: 0
        },
        achievements: [],
        image: "https://lh3.googleusercontent.com/sitesv/AG8ngQWNNuxYmiXWrPGpM3k0UNt_etHftcLG9qXR2IqiSP_LXsmCQvCDRmNwUcnDTXdcYnp3-VIJlMGlEd-IQfCy4QpR0TNFAzdmwi2oZRmBZVfXNLWshpk5GVepPIA-rKKiGzbopKlerfNttllVOGG1Zw1xEVmMfvCl5qKO5t_1oQ_7UEZ6-52CInk7uEKqqJKoxU3lmGdCsh281QOv3hcdoRgKO6uSvGLcOaHX0UBpDLs=w1280",
        cardBg: "var(--color-sky)"
    },
    {
        id: "ramadhona",
        name: "Ramadhona",
        gender: "male",
        division: "BAZNAS RI",
        isPlayerOfTheMonth: false,
        stats: {
            attendance: 0,
            matches: 0,
            wins: 0,
            losses: 0
        },
        achievements: [],
        image: "https://lh3.googleusercontent.com/sitesv/AG8ngQWNNuxYmiXWrPGpM3k0UNt_etHftcLG9qXR2IqiSP_LXsmCQvCDRmNwUcnDTXdcYnp3-VIJlMGlEd-IQfCy4QpR0TNFAzdmwi2oZRmBZVfXNLWshpk5GVepPIA-rKKiGzbopKlerfNttllVOGG1Zw1xEVmMfvCl5qKO5t_1oQ_7UEZ6-52CInk7uEKqqJKoxU3lmGdCsh281QOv3hcdoRgKO6uSvGLcOaHX0UBpDLs=w1280",
        cardBg: "var(--color-coral)"
    },
    {
        id: "riyadh",
        name: "Riyadh",
        gender: "male",
        division: "BAZNAS RI",
        isPlayerOfTheMonth: false,
        stats: {
            attendance: 0,
            matches: 0,
            wins: 0,
            losses: 0
        },
        achievements: [],
        image: "https://lh3.googleusercontent.com/sitesv/AG8ngQWNNuxYmiXWrPGpM3k0UNt_etHftcLG9qXR2IqiSP_LXsmCQvCDRmNwUcnDTXdcYnp3-VIJlMGlEd-IQfCy4QpR0TNFAzdmwi2oZRmBZVfXNLWshpk5GVepPIA-rKKiGzbopKlerfNttllVOGG1Zw1xEVmMfvCl5qKO5t_1oQ_7UEZ6-52CInk7uEKqqJKoxU3lmGdCsh281QOv3hcdoRgKO6uSvGLcOaHX0UBpDLs=w1280",
        cardBg: "var(--color-primary-light)"
    },
    {
        id: "reno",
        name: "Reno",
        gender: "male",
        division: "BAZNAS RI",
        isPlayerOfTheMonth: false,
        stats: {
            attendance: 0,
            matches: 0,
            wins: 0,
            losses: 0
        },
        achievements: [],
        image: "https://lh3.googleusercontent.com/sitesv/AG8ngQXp8atXfvxMFP4ad8n8JXm0k1nLP9wGZ6KbkQRgnz4JQWcfjQDqPCPcqqUQUb8l1ffYcUgG2xno0eETau1-UcTSh8HbzIuoApjocJ3bnYD5YgCChY0X6m5IXb9T219mOX9AEoZOmSIXqrh7sK8510KWJwUo6Eyt-dm0c5HHTdvuMj1YNYxPZks7ybNdsZ6LQ8nWDGr64mNye99xCgBEMQEgC3pYaipSusx8cTfpphA=w1280",
        cardBg: "var(--color-yellow)"
    },
    {
        id: "wanto",
        name: "Wanto",
        gender: "male",
        division: "BAZNAS RI",
        isPlayerOfTheMonth: false,
        stats: {
            attendance: 0,
            matches: 0,
            wins: 0,
            losses: 0
        },
        achievements: [],
        image: "https://lh3.googleusercontent.com/sitesv/AG8ngQVvRAcultUvp7d_ogFCy5nq-v20xFPLcsHq99yyz6Ovp38jlO4U9B_tMHS8CsmhOzQnNBwG-62EZtczj2jIi26pzKFZAqGt_RJqB0Ay5Jd92cPR70f9QM_YzDvpPlJ2WJVBt5jTXi4RBryMvpsQQW3q1bpjIfEy4oy9ui-BPcXXzmkt5zh8bxPrH74mJcanh581XTiGQsgwCG4rzGyOUpSClv_SjA0C0_fp72KDB7U=w1280",
        cardBg: "var(--color-sky)"
    },
    {
        id: "arum",
        name: "Arum",
        gender: "female",
        division: "BAZNAS RI",
        isPlayerOfTheMonth: false,
        stats: {
            attendance: 0,
            matches: 0,
            wins: 0,
            losses: 0
        },
        achievements: [],
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600",
        cardBg: "var(--color-coral)"
    },
    {
        id: "nur",
        name: "Nur",
        gender: "female",
        division: "BAZNAS RI",
        isPlayerOfTheMonth: false,
        stats: {
            attendance: 0,
            matches: 0,
            wins: 0,
            losses: 0
        },
        achievements: [],
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600",
        cardBg: "var(--color-yellow)"
    },
    {
        id: "eneng",
        name: "Eneng",
        gender: "female",
        division: "BAZNAS RI",
        isPlayerOfTheMonth: false,
        stats: {
            attendance: 0,
            matches: 0,
            wins: 0,
            losses: 0
        },
        achievements: [],
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600",
        cardBg: "var(--color-sky)"
    },
    {
        id: "vinda",
        name: "Vinda",
        gender: "female",
        division: "BAZNAS RI",
        isPlayerOfTheMonth: false,
        stats: {
            attendance: 0,
            matches: 0,
            wins: 0,
            losses: 0
        },
        achievements: [],
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600",
        cardBg: "var(--color-primary-light)"
    },
    {
        id: "visty",
        name: "Visty",
        gender: "female",
        division: "BAZNAS RI",
        isPlayerOfTheMonth: false,
        stats: {
            attendance: 0,
            matches: 0,
            wins: 0,
            losses: 0
        },
        achievements: [],
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600",
        cardBg: "var(--color-coral)"
    }
];