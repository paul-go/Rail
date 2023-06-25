
namespace Rail
{
	/** */
	export class StoryFrameHat
	{
		readonly head;
		
		/** */
		constructor(sections: HTMLElement[], drawer: HTMLElement)
		{
			if (sections.length < 1)
				throw new Error("Must have at least one section.");
			
			const snap: Hot.Style = {
				scrollSnapStop: "always",
				scrollSnapAlign: "start",
			};
			
			const children: HTMLElement[] = [];
			
			for (const [i, section] of sections.entries())
			{
				children.push(
					hot.div(
						"snap-left",
						snap,
						{
							gridRow: i + 2,
							gridColumn: 1,
							background: "linear-gradient(45deg, purple, orange)"
						}
					),
					
					hot.get(section)({
						gridRow: i + 2,
						gridColumn: 2,
						...snap,
					}),
					
					hot.div(
						"snap-right",
						snap,
						{
							gridRow: i + 2,
							gridColumn: 3,
							scrollSnapAlign: "end",
							background: "linear-gradient(45deg, orange, purple)"
						}
					),
				);
			}
			
			this.head = hot.div(
				"head",
				{
					width: "100%",
					height: "100%",
					overflow: "auto",
					scrollSnapType: "both mandatory",
					backgroundColor: "rgba(0, 0, 0, 0.33)",
				},
				hot.on("connected", () =>
				{
					// The scroll event needs to be behind an additional
					// setTimeout, otherwise it won't skip to the right position.
					// I already tried putting the connected event elsewhere
					// with no luck.
					setTimeout(() =>
					{
						this.head.scrollBy({
							top: this.head.offsetHeight,
							left: this.head.offsetWidth,
							behavior: "auto"
						});
						
						//this.setupScrollTracker();
					});
				}),
				hot.div(
					{
						display: "grid",
						width: "300%",
						gridTemplateColumns: "1fr 1fr 1fr",
						gridTemplateRows: "1fr ".repeat(sections.length + 2),
					},
					hot.div(
						"snap-top",
						snap,
						Cq.height(100, "head"),
						{
							gridRow: 1,
							gridColumnStart: 2,
							gridColumnEnd: 5,
						}
					),
					hot.div(
						"snap-bottom",
						snap,
						Cq.height(100, "head"),
						{
							gridRow: -1,
							gridColumnStart: 2,
							gridColumnEnd: 5,
						}
					),
					/*
					hot.div(
						"sections-background",
						{
							gridColumn: 3,
							gridRowStart: 2,
							gridRowEnd: -2,
							backgroundColor: "black",
						}
					),
					hot.div(
						"snap-left",
						snap,
						{
							gridRowStart: 1,
							gridRowEnd: -1,
							gridColumn: 1,
						}
					),
					hot.div(
						"snap-right",
						snap,
						{
							gridRowStart: 1,
							gridRowEnd: -1,
							gridColumn: 5,
						}
					),
					
					...sections,
					*/
					
					...children,
					
					hot.div(
						"about",
						{
							gridColumn: 4,
							gridRowStart: 2,
							gridRowEnd: -2,
							backgroundColor: "orange",
							position: "sticky",
							top: 0,
							overflowY: "auto",
						},
						Cq.height(100, "head"),
						drawer,
					)
				),
			);
			
			Hat.wear(this);
		}
		
		/** */
		private setupScrollTracker()
		{
			const e = this.head;
			let lastScrollTop = -1;
			let lastScrollLeft = -1;
			let timeoutId: any = 0;
			
			e.addEventListener("scroll", () =>
			{
				const coords: number[] = new Array(8);
				
				const w = e.offsetWidth;
				if (e.scrollLeft < w)
					coords[0] = coords[6] = 1 - e.scrollLeft / w;
				
				const h = e.offsetHeight;
				if (e.scrollTop < h)
					coords[1] = coords[3] = 1 - (e.scrollTop / h);
				
				else if (e.scrollTop > e.scrollHeight - h * 2)
					coords[5] = coords[7] = 1 - (e.scrollTop - h * 2) / h;
				
				if (coords.every(n => n === undefined))
					return e.style.removeProperty("clip-path");
				
				coords[0] ??= 0;
				coords[1] ??= 0;
				coords[2] = 1;
				coords[3] ??= 0;
				coords[4] = 1;
				coords[5] ??= 1;
				coords[6] ??= 0;
				coords[7] ??= 1;
				
				const c = coords.map(c => (c * 100).toFixed(3) + "%");
				c.splice(6, 0, `,`);
				c.splice(4, 0, `,`);
				c.splice(2, 0, `,`);
				e.style.clipPath = "polygon(" + c.join(" ") + ")";
				
				if (e.scrollTop === 0 ||
					e.scrollTop >= e.scrollHeight - h ||
					e.scrollLeft === 0)
					e.remove();
				
				lastScrollLeft = e.scrollLeft;
				lastScrollTop = e.scrollTop;
				
				clearTimeout(timeoutId);
				timeoutId = setTimeout(() =>
				{
					if (e.scrollLeft !== lastScrollLeft || e.scrollTop !== lastScrollTop)
						return;
					
					// A more elegant way to deal with this would be to animate
					// it off the screen... but just removing it is good enough for now
					// because this is just an edge case that isn't going to happen
					// very often.
					if (e.scrollLeft <= 0 ||
						e.scrollTop <= 0 ||
						e.scrollTop >= e.scrollHeight - e.offsetHeight)
						e.remove();
				},
				500);
			});
		}
	}
}
