solver.js:
	notangle solver.nw > solver.js

solver.pdf: solver.tex
	pdflatex -interaction=nonstopmode -halt-on-error solver.tex

solver.tex:
	noweave solver.nw  > solver.tex

clean:
	rm -f solver.aux solver.js solver.log solver.pdf solver.tex
