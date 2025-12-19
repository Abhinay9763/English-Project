export default function Creators() {
    const members = [
        { name: "V Abhinay Kumar", id: "25K81A0561" },
        { name: "T. Sai Dinesh", id: "25K81A0557" },
        { name: "Vishal Prabodh T", id: "25K81A0562" },
        { name: "M Aditya Yadav", id: "25K81A0538" },
    ];

    return (
        <div className="mt-24 mb-16 w-full max-w-5xl mx-auto px-4">
            <div className="flex items-center justify-center gap-4 mb-12">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyan-500/50"></div>
                <h2 className="text-2xl md:text-3xl font-black text-center rainbow-text uppercase tracking-[0.2em]">
                    The Development Team
                </h2>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-500/50"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {members.map((member, idx) => (
                    <div
                        key={idx}
                        className="group relative"
                    >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-500"></div>
                        <div className="relative glass-effect p-6 rounded-2xl border border-white/5 text-center hover:border-cyan-500/30 transition-all duration-300">
                            <div className="text-gray-100 font-bold text-lg mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-500 transition-all duration-300">
                                {member.name}
                            </div>
                            <div className="text-cyan-400 font-mono text-sm tracking-widest bg-cyan-950/30 px-3 py-1 rounded-full border border-cyan-500/10 inline-block mt-2">
                                {member.id}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
