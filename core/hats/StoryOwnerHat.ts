
namespace Rail
{
	/** */
	export class StoryOwnerHat
	{
		readonly head;
		
		/** */
		constructor()
		{
			this.head = hot.div(
				"story-owner-hat",
				{
					display: "flex",
					height: "100%",
					padding: "30px",
				},
				hot.div(
					Style.backdropBlur(5),
					{
						flex: "1 0",
						width: "100%",
						height: "100%",
						backgroundColor: "rgba(128, 128, 128, 0.33)",
						backdropFilter: "blur(8px)",
						borderRadius: "30px",
					}
				)
			);
		}
	}
}
