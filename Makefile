solver.js:
	notangle solver.nw > solver.js

solver.pdf: solver.tex
	pdflatex solver.tex

solver.tex:
	noweave solver.nw > solver.tex
