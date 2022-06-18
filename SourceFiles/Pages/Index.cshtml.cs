using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using System.IO;
using Microsoft.AspNetCore.Html;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.Hosting;
using MySqlConnector;

namespace EdgyGames.Pages
{
	//[Produces("application/json")]
	public class IndexModel : PageModel
	{
		private readonly IWebHostEnvironment _webHostEnvironment;

		/** <summary> Paths to game menu images </summary> */
		public List<string> GameMenuImages { get; private set; } = new List<string>();

		public IndexModel(IWebHostEnvironment webHost)
        {
			_webHostEnvironment = webHost;
        }
		
		public void OnGet()
		{
			var provider = new PhysicalFileProvider(_webHostEnvironment.WebRootPath);
			var imageContents = provider.GetDirectoryContents("Images");
			foreach (var image in imageContents)
			{
				GameMenuImages.Add("Images/" + image.Name);
			}
			//Page().ViewData["Title"] = "New title";
        }
	}

}
