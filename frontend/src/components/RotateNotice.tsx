export default function RotateNotice() {
    return (
        <div className="fixed z-999 inset-0 flex flex-col items-center justify-center bg-slate-900 text-white text-center p-6 lg:hidden portrait:flex landscape:hidden">
            <div className="mb-4 text-6xl animate-bounce">🔄</div>
            <h2 className="text-2xl font-bold mb-2">Obróć urządzenie</h2>
            <p className="text-slate-400">
                Aby rysować i widzieć tablicę, musisz trzymać telefon w poziomie.
        </p>
    </div>
    )
}