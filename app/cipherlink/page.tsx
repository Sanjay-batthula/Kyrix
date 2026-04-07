"use client"

export default function CipherlinkPage() {
	return (
		<div className="w-screen h-screen bg-[#faf9f7] p-0 m-0 overflow-hidden">
			<iframe
				src="https://www.gbrl.ai/"
				title="GBRL.ai Embedded"
				width="100%"
				height="100%"
				style={{ border: 'none', width: '100vw', height: '100vh', display: 'block' }}
				allow="microphone; camera; clipboard-read; clipboard-write; display-capture"
				allowFullScreen
			/>
		</div>
	)
}
